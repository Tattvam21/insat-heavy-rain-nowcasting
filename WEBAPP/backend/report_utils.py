from __future__ import annotations

import base64
from datetime import datetime
from io import BytesIO
from textwrap import fill

import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages


def _decode_base64_png(image_b64: str):
    image_bytes = base64.b64decode(image_b64)
    return plt.imread(BytesIO(image_bytes), format="png")


def _risk_level(probability: float) -> str:
    if probability >= 0.7:
        return "High"
    if probability >= 0.4:
        return "Moderate"
    return "Low"


def _explanation(probability: float, prediction: str) -> str:
    if prediction.lower().startswith("heavy"):
        if probability >= 0.7:
            return (
                "The model predicts a heavy rainfall episode with high confidence. "
                "The Grad-CAM map should be read as the primary cloud regions that contributed "
                "to this positive decision."
            )
        return (
            "The model predicts heavy rainfall but confidence is moderate. "
            "Treat this as a watch condition and confirm with additional observations."
        )
    if probability <= 0.3:
        return (
            "The model predicts no heavy rainfall with high confidence. "
            "Highlighted regions in Grad-CAM are still influential for the negative class."
        )
    return (
        "The model predicts no heavy rainfall with moderate confidence. "
        "This is close to the decision boundary and can change as new frames arrive."
    )


def build_prediction_report_pdf(
    probability: float,
    prediction: str,
    input_images_b64: list[str],
    gradcam_b64: str,
) -> bytes:

    frame_images = [_decode_base64_png(img_b64) for img_b64 in input_images_b64[:3]]
    while len(frame_images) < 3:
        frame_images.append(None)

    gradcam_image = _decode_base64_png(gradcam_b64) if gradcam_b64 else None

    report_buffer = BytesIO()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    risk_level = _risk_level(probability)
    explanation = _explanation(probability, prediction)

    with PdfPages(report_buffer) as pdf:

        # 🔹 Smaller figure size (no full A4)
        fig = plt.figure(figsize=(8, 10))

        fig.suptitle(
            "Heavy Rainfall Nowcasting Report",
            fontsize=16,
            fontweight="bold",
            y=0.97,
        )

        metadata_lines = [
            f"Generated At: {created_at}",
            f"Prediction: {prediction}",
            f"Heavy Rain Probability: {probability * 100:.2f}%",
            f"Risk Level: {risk_level}",
            "Model: CNNPatchMulti (9-channel input from 3 temporal frames)",
        ]

        fig.text(0.08, 0.90, "\n".join(metadata_lines), fontsize=10, va="top")

        # 🔹 Slightly tightened vertical spacing
        fig.text(0.08, 0.76, "Prediction Explanation", fontsize=12, fontweight="bold", va="top")
        fig.text(0.08, 0.72, fill(explanation, width=90), fontsize=10, va="top")

        interpretation = (
            "Grad-CAM is an attention map indicating where the model focused most. "
            "Warmer regions represent stronger contribution to the model output. "
            "This is not a physical precipitation map, but an explanation of model behavior."
        )
        failure_cases = (
            "Known failure modes include thin cloud layers, rapidly evolving convection "
            "between frames, or cloud structures that resemble heavy-rain signatures "
            "without producing strong surface rainfall."
        )

        fig.text(0.08, 0.62, "Interpretation Notes", fontsize=12, fontweight="bold", va="top")
        fig.text(0.08, 0.58, fill(interpretation, width=90), fontsize=10, va="top")

        fig.text(0.08, 0.50, "Potential Failure Cases", fontsize=12, fontweight="bold", va="top")
        fig.text(0.08, 0.46, fill(failure_cases, width=90), fontsize=10, va="top")

        fig.text(
            0.08,
            0.40,
            "Note: Use this output with meteorological context and operational checks.",
            fontsize=9,
            style="italic",
        )

        # 🔹 Images placed at bottom (compact)
        axes = fig.subplots(1, 4)
        titles = [
            "Input Frame 1 (Oldest)",
            "Input Frame 2",
            "Input Frame 3 (Latest)",
            "Grad-CAM Overlay",
        ]
        images = [frame_images[0], frame_images[1], frame_images[2], gradcam_image]

        for ax, title, image in zip(axes, titles, images):
            ax.set_position([0.05 + titles.index(title)*0.23, 0.08, 0.20, 0.20])
            ax.set_title(title, fontsize=8)
            ax.axis("off")

            if image is not None:
                ax.imshow(image)
            else:
                ax.text(
                    0.5,
                    0.5,
                    "Image not available",
                    transform=ax.transAxes,
                    ha="center",
                    va="center",
                    fontsize=8,
                )

        pdf.savefig(fig)
        plt.close(fig)

    report_buffer.seek(0)
    return report_buffer.getvalue()
