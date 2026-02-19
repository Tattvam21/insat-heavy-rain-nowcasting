import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image

def generate_gradcam(model, img_tensor):

    model.eval()
    input_tensor = torch.tensor(img_tensor, dtype=torch.float32)

    activations = None
    gradients = None

    def forward_hook(module, input, output):
        nonlocal activations
        activations = output

    def backward_hook(module, grad_input, grad_output):
        nonlocal gradients
        gradients = grad_output[0]

    handle_f = model.conv3.register_forward_hook(forward_hook)
    handle_b = model.conv3.register_backward_hook(backward_hook)

    output = model(input_tensor)
    model.zero_grad()
    output.backward()

    weights = torch.mean(gradients, dim=(2,3), keepdim=True)
    cam = torch.sum(weights * activations, dim=1).squeeze()

    cam = F.relu(cam)
    cam = cam.detach().numpy()
    cam = cv2.resize(cam, (64,64))

    cam = cam - cam.min()
    cam = cam / (cam.max() + 1e-8)

    heatmap = cv2.applyColorMap(np.uint8(255*cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    return Image.fromarray(heatmap)
