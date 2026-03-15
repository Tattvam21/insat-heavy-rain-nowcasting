import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from pathlib import Path
from sklearn.metrics import f1_score, accuracy_score
from model_cnn_patch_multi import CNNPatchMulti

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
print("Device:", device)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "DATASET/PROCESSED"

X_train = torch.tensor(np.load(DATA_DIR / "X_multi_train.npy"), dtype=torch.float32).to(device)
Y_train = torch.tensor(np.load(DATA_DIR / "Y_multi_train.npy"), dtype=torch.float32).to(device)

X_val = torch.tensor(np.load(DATA_DIR / "X_multi_val.npy"), dtype=torch.float32).to(device)
Y_val = torch.tensor(np.load(DATA_DIR / "Y_multi_val.npy"), dtype=torch.float32).to(device)

X_test = torch.tensor(np.load(DATA_DIR / "X_multi_test.npy"), dtype=torch.float32).to(device)
Y_test = torch.tensor(np.load(DATA_DIR / "Y_multi_test.npy"), dtype=torch.float32).to(device)

model = CNNPatchMulti().to(device)

pos_weight = (len(Y_train) - Y_train.sum()) / Y_train.sum()
criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
optimizer = optim.Adam(model.parameters(), lr=1e-3)

epochs = 12
batch_size = 256

for epoch in range(epochs):

    model.train()
    perm = torch.randperm(X_train.size(0))
    total_loss = 0

    for i in range(0, X_train.size(0), batch_size):
        idx = perm[i:i+batch_size]
        batch_x = X_train[idx]
        batch_y = Y_train[idx]

        optimizer.zero_grad()
        outputs = model(batch_x).squeeze()
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    model.eval()
    with torch.no_grad():
        val_logits = model(X_val).squeeze()
        val_probs = torch.sigmoid(val_logits)
        val_preds = (val_probs > 0.5).float()

        val_acc = accuracy_score(Y_val.cpu(), val_preds.cpu())
        val_f1 = f1_score(Y_val.cpu(), val_preds.cpu())

    print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss:.2f} | Val Acc: {val_acc:.4f} | Val F1: {val_f1:.4f}")

# Test
model.eval()
with torch.no_grad():
    test_logits = model(X_test).squeeze()
    test_probs = torch.sigmoid(test_logits)
    test_preds = (test_probs > 0.5).float()

    test_acc = accuracy_score(Y_test.cpu(), test_preds.cpu())
    test_f1 = f1_score(Y_test.cpu(), test_preds.cpu())

print("\n📊 Multi-frame Patch t+3 Nowcast")
print("Test Accuracy:", test_acc)
print("Test F1-score:", test_f1)

torch.save(model.state_dict(), PROJECT_ROOT / "Models/patch_multiframe_t3(2).pth")
print("Multi-frame model saved.")
