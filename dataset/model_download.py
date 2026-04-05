import ultralytics
import roboflow
import os

# Create local directories
weights_dir = "redqueen/train/weights"
output_dir = "output"

os.makedirs(weights_dir, exist_ok=True)
os.makedirs(output_dir, exist_ok=True)

print("✅ All packages installed and directories ready")

from roboflow import Roboflow

rf = Roboflow(api_key="FRQg51Kouh5VB5OMxqx0")

project = rf.workspace("nagy-mfvph").project("badges-full-pidray")

dataset = project.version(1).download("yolov8")

dataset_path = dataset.location
print("Dataset path:", dataset_path)
print("Contents:", os.listdir(dataset_path))

# Check image counts
for split in ['train', 'valid', 'test']:
    img_path = os.path.join(dataset_path, split, 'images')

    if os.path.exists(img_path):
        count = len(os.listdir(img_path))
        print(f"{split}: {count} images")