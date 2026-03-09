## Plant Diagnosis Model

This folder contains training code for a custom plant health diagnostic model.

High-level goals:
- Fine-tune a modern vision backbone (e.g. ConvNeXt-Tiny) for:
  - `health_status` (single-label classification)
  - `issue_tags` (multi-label classification)
- Evaluate with clear metrics and export a checkpoint for deployment.

### Project layout

- `data/`
  - `images/` – raw training images (JPEG/PNG).
  - `labels.jsonl` – one JSON record per image with:
    - `image`: filename in `images/`
    - `health_status`: `"healthy" | "mildly_stressed" | "unhealthy"`
    - `issue_tags`: list of strings from a fixed ontology.
- `plant_diagnosis/`
  - `__init__.py` – package marker.
  - `config.py` – dataclasses / typed config objects.
  - `dataset.py` – PyTorch dataset + transforms.
  - `model.py` – ConvNeXt-based multi-task model definition.
  - `train.py` – training loop entrypoint.
  - `eval.py` – evaluation script (metrics, confusion matrix, per-label F1).
- `configs/`
  - `default.yaml` – default hyperparameters (paths, batch size, lr, etc.).
- `requirements.txt` – Python dependencies.

This is a standalone training package; the Cloudflare Worker app can load the exported model via a separate serving stack (e.g. FastAPI).

