import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

X = np.load(BASE_DIR / "X_patch_multiframe_t3.npy")
Y = np.load(BASE_DIR / "Y_patch_multiframe_t3.npy")

frames = 3069
patches_per_frame = 16

# reshape back to frame structure
X = X.reshape(frames, patches_per_frame, 9, 64, 64)
Y = Y.reshape(frames, patches_per_frame)

train_end = int(0.7 * frames)
val_end = int(0.85 * frames)

X_train = X[:train_end]
Y_train = Y[:train_end]

X_val = X[train_end:val_end]
Y_val = Y[train_end:val_end]

X_test = X[val_end:]
Y_test = Y[val_end:]

# flatten
X_train = X_train.reshape(-1, 9, 64, 64)
Y_train = Y_train.reshape(-1)

X_val = X_val.reshape(-1, 9, 64, 64)
Y_val = Y_val.reshape(-1)

X_test = X_test.reshape(-1, 9, 64, 64)
Y_test = Y_test.reshape(-1)

print("Train ratio:", Y_train.mean())
print("Val ratio:", Y_val.mean())
print("Test ratio:", Y_test.mean())

np.save(BASE_DIR / "X_multi_train.npy", X_train)
np.save(BASE_DIR / "Y_multi_train.npy", Y_train)

np.save(BASE_DIR / "X_multi_val.npy", X_val)
np.save(BASE_DIR / "Y_multi_val.npy", Y_val)

np.save(BASE_DIR / "X_multi_test.npy", X_test)
np.save(BASE_DIR / "Y_multi_test.npy", Y_test)

print("✅ Multi-frame split saved.")
