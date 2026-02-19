import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

X = np.load(BASE_DIR / "X_patch_event.npy")
Y = np.load(BASE_DIR / "Y_patch_event.npy")

frames = 3074
patches_per_frame = 16
lead = 3
history = 3  # t-2, t-1, t

print("Original shape:", X.shape)

# reshape to frame structure
X = X.reshape(frames, patches_per_frame, 3, 64, 64)
Y = Y.reshape(frames, patches_per_frame)

X_multi = []
Y_multi = []

# valid range:
# earliest input frame = history-1
# latest input frame = frames - lead - 1
for t in range(history-1, frames-lead):

    # stack history frames
    past_frames = X[t-history+1:t+1]   # shape (3, 16, 3, 64, 64)

    # reshape history into channels
    # (history, patches, channels, H, W)
    past_frames = past_frames.transpose(1,0,2,3,4)
    # now (patches, history, channels, H, W)

    past_frames = past_frames.reshape(patches_per_frame,
                                      history*3, 64, 64)

    target = Y[t+lead]

    X_multi.append(past_frames)
    Y_multi.append(target)

X_multi = np.array(X_multi)   # (new_frames, 16, 9, 64, 64)
Y_multi = np.array(Y_multi)   # (new_frames, 16)

print("Frame-wise multi shape:", X_multi.shape)

# flatten patches
X_multi = X_multi.reshape(-1, history*3, 64, 64)
Y_multi = Y_multi.reshape(-1)

print("Final multi-frame shape:", X_multi.shape)
print("Event ratio:", Y_multi.mean())

np.save(BASE_DIR / "X_patch_multiframe_t3.npy", X_multi)
np.save(BASE_DIR / "Y_patch_multiframe_t3.npy", Y_multi)

print("✅ Multi-frame patch t+3 dataset saved.")
