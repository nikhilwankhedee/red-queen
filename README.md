# RED QUEEN
### Cargo Intelligence & Border Security System

> "I'm sorry, but I can't allow that shipment to pass."

Named after the adaptive AI defense system — **Red Queen detects what humans miss.**

![status](https://img.shields.io/badge/status-in%20development-red)  
![hackathon](https://img.shields.io/badge/hackathon-TESSARACT'26-blue)  
![model](https://img.shields.io/badge/model-YOLOv8-orange)

---

# Overview

**Red Queen** is an AI-powered cargo inspection system designed for customs and border security environments.

The system analyzes **cargo X-ray scans** to detect prohibited items, misdeclared goods, and suspicious anomalies before shipments reach manual inspection.

Instead of replacing officers, Red Queen acts as a **decision intelligence layer** that prioritizes the highest-risk cargo.

Every detection produces:

- Object detection bounding boxes
- Risk classification
- Suspicion score
- Explainable AI heatmaps
- Human-readable reasoning

This allows border officers to quickly understand **why** a shipment was flagged.

---

# Problem

Customs agencies inspect thousands of cargo shipments daily across:

- Sea ports
- Airports
- Land borders

Manual X-ray analysis suffers from three structural limitations:

| Problem | Impact |
|------|------|
| High Volume | Officers process hundreds of scans per shift |
| Human Fatigue | Increased probability of missed threats |
| Reactive Systems | Dangerous cargo detected too late |

Contraband such as:

- weapons
- narcotics
- undeclared electronics
- smuggled goods

can bypass detection due to scale and complexity.

---

# Solution

Red Queen introduces an **AI co-pilot system** for cargo inspection.

Every X-ray image is processed through a deep learning pipeline that identifies suspicious patterns and flags high-risk shipments.

Only the shipments that require human intervention are surfaced.

This reduces inspection workload while improving detection reliability.

---

# Core Capabilities

| Capability | Description |
|------|------|
| Object Detection | Identifies prohibited items using YOLOv8 |
| Risk Classification | Categorizes objects as PROHIBITED, RESTRICTED, SUSPICIOUS, or NORMAL |
| Anomaly Detection | Detects structural deviations from normal cargo |
| Manifest Cross-Check | Compares declared cargo vs detected items |
| Risk Scoring | Generates a suspicion score (0.00–1.00) |
| Explainability | Produces GradCAM heatmaps for flagged detections |
| Port Intelligence | Visualizes incoming vessels with risk indicators |

---

# System Modes

## X-Ray Scan Mode

Users upload a cargo X-ray image.

The system returns:

- Annotated detection image
- Object list with confidence scores
- Cargo manifest mismatch alerts
- Risk classification badge
- Explainability heatmap
- AI-generated explanation

---

## Port Intelligence Mode

A tactical map interface displaying incoming vessels.

Each vessel is analyzed based on:

- route history
- origin country
- declared cargo
- AIS status

Risk levels are visualized using:

- **RED** – High risk  
- **AMBER** – Medium risk  
- **GREEN** – Normal  

---

# Dataset

This project is trained and evaluated using the **PIDray dataset**.

| Dataset | Description |
|------|------|
| PIDray | A large-scale X-ray security dataset containing prohibited items commonly encountered in cargo and baggage inspection scenarios. |

The PIDray dataset contains:

- **124,000+ annotated X-ray images**
- **12 prohibited object categories**
- Bounding box annotations for object detection

Example categories include:

- knives
- scissors
- guns
- tools
- wrenches
- pliers
- batteries
- electronic devices

PIDray is specifically designed for **security inspection AI systems**, making it well suited for customs and border protection applications like **Red Queen**.
---

# Model Architecture

```
Input X-ray Image
        ↓
Preprocessing
(CLAHE enhancement + grayscale normalization)
        ↓
AI Inference Engine
    ├── YOLOv8 (Object Detection)
    ├── Autoencoder (Anomaly Detection)
    └── ResNet Comparator
        ↓
Risk Aggregation Engine
        ↓
Risk Score + Detection + Explanation
```

---

# Technology Stack

| Layer | Technology |
|------|------|
| Frontend | React + TailwindCSS |
| Backend | FastAPI |
| Object Detection | YOLOv8 (Ultralytics) |
| Anomaly Detection | PyTorch Autoencoder |
| Explainability | pytorch-grad-cam |
| Image Processing | OpenCV |
| Training | Kaggle GPU environment |
| Database | SQLite |

---

# Evaluation Metrics

The system is evaluated using metrics appropriate for security systems.

Key evaluation metrics include:

- Precision
- Recall
- mAP@50
- mAP@50-95
- False Positives
- False Negatives

Maintaining low false negatives is critical to avoid missed threats.

---

# Project Structure

```
red-queen/
│
├── frontend/        # React dashboard interface
├── backend/         # FastAPI inference server
├── notebooks/       # model training experiments
├── models/          # trained model weights
├── data/
│   └── samples/     # demo X-ray images
│
├── requirements.txt
└── README.md
```

---

# Team

**Team Umbrella**

Built for **TESSARACT'26 Hackathon**.

---

# Disclaimer

Red Queen is a **research prototype** developed for academic and hackathon purposes.

The system is designed to **assist human inspection workflows**, not replace professional decision-making.

All datasets used are open-source and permitted for research use.