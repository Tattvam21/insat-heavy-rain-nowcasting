import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import cv2
import base64
from io import BytesIO
from pathlib import Path
import matplotlib.pyplot as plt


# ================= MODEL =================

class CNNPatchMulti(nn.Module):
    def __init__(self):
        super().__init__()

        self.conv1 = nn.Conv2d(9, 32, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)

        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)

        self.conv3 = nn.Conv2d(64, 128, 3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)

        self.pool = nn.MaxPool2d(2, 2)
        self.relu = nn.ReLU()
        self.fc = nn.Linear(128, 1)

    def forward(self, x):
        x = self.pool(self.relu(self.bn1(self.conv1(x))))
        x = self.pool(self.relu(self.bn2(self.conv2(x))))
        x = self.pool(self.relu(self.bn3(self.conv3(x))))
        x = F.adaptive_avg_pool2d(x, (1,1))
        x = torch.flatten(x,1)
        x = self.fc(x)
        return x


# ================= LOAD =================

def load_model():
    PROJECT_ROOT = Path(__file__).resolve().parents[2]
    model = CNNPatchMulti()
    model.load_state_dict(
        torch.load(PROJECT_ROOT / "Models/patch_multiframe_t3.pth",
                   map_location="cpu")
    )
    model.eval()
    return model


# ================= GRADCAM =================

def generate_gradcam(model, input_tensor):

    gradients = []
    activations = []

    def forward_hook(module, input, output):
        activations.append(output)

    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    handle_f = model.conv3.register_forward_hook(forward_hook)
    handle_b = model.conv3.register_backward_hook(backward_hook)

    output = model(input_tensor)
    model.zero_grad()
    output.backward()

    grads = gradients[0]
    acts = activations[0]

    weights = torch.mean(grads, dim=(2,3), keepdim=True)
    cam = torch.sum(weights * acts, dim=1).squeeze()

    cam = F.relu(cam)
    cam -= cam.min()
    cam /= (cam.max() + 1e-8)

    cam = cam.detach().cpu().numpy()
    cam = cv2.resize(cam, (256,256))  # BIGGER (6x)

    handle_f.remove()
    handle_b.remove()

    return cam


# ================= PREDICT =================

def predict(model, np_patch):

    if np_patch.shape != (9,64,64):
        raise ValueError("Expected shape (9,64,64)")

    input_tensor = torch.tensor(np_patch).unsqueeze(0).float()

    with torch.no_grad():
        output = model(input_tensor)
        prob = torch.sigmoid(output).item()

    cam = generate_gradcam(model, input_tensor)

    def render_patch(ch_start):
        patch = np_patch[ch_start:ch_start + 3]
        patch = np.transpose(patch, (1, 2, 0))
        patch = (patch - patch.min()) / (patch.max() - patch.min() + 1e-8)
        patch = cv2.resize(patch, (256, 256))
        return patch

    # Three temporal patches (3 channels each from the 9-channel tensor)
    patch_images = [render_patch(0), render_patch(3), render_patch(6)]
    img = patch_images[0]

    heatmap = plt.get_cmap("jet")(cam)[:,:,:3]
    overlay = 0.6 * img + 0.4 * heatmap
    overlay = np.clip(overlay, 0, 1)

    def to_base64(image):
        buf = BytesIO()
        plt.figure(figsize=(5,5))
        plt.imshow(image)
        plt.axis("off")
        plt.tight_layout()
        plt.savefig(buf, format="png")
        plt.close()
        return base64.b64encode(buf.getvalue()).decode()

    input_images_b64 = [to_base64(patch_img) for patch_img in patch_images]
    input_b64 = input_images_b64[0]
    gradcam_b64 = to_base64(overlay)

    return prob, gradcam_b64, input_b64, input_images_b64
