# Models

This folder stores trained ML models and model artifacts.

## Contents

- `*.pt` / `*.pth` - PyTorch model weights
- `*.onnx` - ONNX format models
- `*.bin` - Binary model files
- Configuration files for model architectures

## Important

⚠️ **Do not commit large model files to Git.** 

Model files are excluded via `.gitignore`. Use one of these approaches:
- Download models from cloud storage (S3, GCS, etc.)
- Use git-lfs for versioned model files
- Store model download links in documentation

## Model Sources

Document where each model comes from:
- Custom trained models
- Pre-trained weights (YOLO, ResNet, etc.)
- Fine-tuned variants
