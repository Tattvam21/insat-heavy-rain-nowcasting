# INSAT Heavy Rain Nowcasting (XAI)

Deep learning + explainable AI web app for short-range heavy rain nowcasting from INSAT satellite patches.

The app predicts heavy rainfall likelihood from a `.npy` patch and visualizes model attention with Grad-CAM.

## Features

- Heavy rain classification from INSAT patch tensor
- Explainability with Grad-CAM visualization
- Multi-patch preview in UI (Patch 1, Patch 2, Patch 3)
- Report export endpoint (PDF)
- Full-stack setup:
  - FastAPI backend (`WEBAPP/backend`)
  - Next.js frontend (`WEBAPP/frontend`)

## Tech Stack

- Backend: FastAPI, PyTorch, NumPy, OpenCV, Matplotlib
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Model: `CNNPatchMulti` with weights from `Models/patch_multiframe_t3.pth`

## Repository Structure

```text
.
├── DATASET/
├── Models/
├── NOTEBOOKS/
├── WEBAPP/
│   ├── backend/
│   │   ├── main.py
│   │   ├── model_loader.py
│   │   ├── report_utils.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── app/
│       ├── components/
│       ├── package.json
│       └── ...
└── README.md
```

## Input Format

The prediction API expects a NumPy file (`.npy`) with shape:

```python
(9, 64, 64)
```

This is treated as 3 temporal patches (3 channels each):

- Patch 1: channels `0:3`
- Patch 2: channels `3:6`
- Patch 3: channels `6:9`

## Backend Setup (FastAPI)

```bash
cd WEBAPP/backend
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`

## Frontend Setup (Next.js)

```bash
cd WEBAPP/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

Optional API base URL override:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## API Endpoints

### `POST /predict`

Upload a `.npy` patch file and get prediction + visual outputs.

**Response (example):**

```json
{
  "probability": 0.56,
  "prediction": "Heavy Rain",
  "gradcam": "<base64_png>",
  "input_image": "<base64_png>",
  "input_images": ["<base64_png>", "<base64_png>", "<base64_png>"]
}
```

### `POST /report`

Upload a `.npy` patch file and receive a downloadable PDF report.

## Development Notes

- Frontend build command:
  - `npm run build -- --webpack` (works reliably in restricted environments)
- If backend visuals or model logic change, restart backend server.
- Model path is loaded relative to project root in:
  - `WEBAPP/backend/model_loader.py`

## Roadmap Ideas

- Add uncertainty estimation and calibration metrics
- Temporal delta view between patch 1/2/3
- Better Grad-CAM controls (opacity toggle, threshold view)
- Authentication + prediction history dashboard

