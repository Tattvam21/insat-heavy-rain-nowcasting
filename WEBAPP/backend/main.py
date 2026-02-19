from datetime import datetime
from io import BytesIO

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from model_loader import load_model, predict
from report_utils import build_prediction_report_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model()


def _load_patch(file_bytes: bytes) -> np.ndarray:
    try:
        return np.load(BytesIO(file_bytes))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid input file. Expected NumPy .npy patch.") from exc


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    np_patch = _load_patch(contents)

    try:
        prob, gradcam_img, input_img, input_images = predict(model, np_patch)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Prediction failed.") from exc

    return {
        "probability": prob,
        "prediction": "Heavy Rain" if prob > 0.5 else "No Heavy Rain",
        "gradcam": gradcam_img,
        "input_image": input_img,
        "input_images": input_images,
    }


@app.post("/report")
async def export_prediction_report(file: UploadFile = File(...)):
    contents = await file.read()
    np_patch = _load_patch(contents)

    try:
        prob, gradcam_img, _, input_images = predict(model, np_patch)
        prediction = "Heavy Rain" if prob > 0.5 else "No Heavy Rain"
        pdf_bytes = build_prediction_report_pdf(
            probability=prob,
            prediction=prediction,
            input_images_b64=input_images,
            gradcam_b64=gradcam_img,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Report generation failed.") from exc

    filename = f"prediction_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}

    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers=headers,
    )
