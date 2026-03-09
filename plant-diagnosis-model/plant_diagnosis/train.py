"""
Minimal training loop entrypoint.

This is a scaffold: fill in data paths, hyperparameters, and add logging as you go.
"""

from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms

from .config import ExperimentConfig
from .dataset import PlantDiagnosisDataset
from .model import PlantDiagnosisNet


def train(experiment: ExperimentConfig) -> None:
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

  data_root = Path(experiment.data.root_dir)

  transform = transforms.Compose(
      [
          transforms.Resize((experiment.data.image_size, experiment.data.image_size)),
          transforms.RandomHorizontalFlip(),
          transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1),
          transforms.ToTensor(),
      ]
  )

  dataset = PlantDiagnosisDataset(root_dir=str(data_root), transform=transform)

  # Build label mappings from dataset
  health_label_to_idx = dataset.health_label_to_idx
  issue_label_to_idx = dataset.issue_label_to_idx

  # Recreate dataset with fixed mappings to avoid recomputing each time
  dataset = PlantDiagnosisDataset(
      root_dir=str(data_root),
      transform=transform,
      health_label_to_idx=health_label_to_idx,
      issue_label_to_idx=issue_label_to_idx,
  )

  dataloader = DataLoader(
      dataset,
      batch_size=experiment.train.batch_size,
      shuffle=True,
      num_workers=experiment.train.num_workers,
  )

  model = PlantDiagnosisNet(
      backbone_name=experiment.model.backbone_name,
      num_health_classes=len(health_label_to_idx),
      num_issue_labels=len(issue_label_to_idx),
  ).to(device)

  ce_loss = nn.CrossEntropyLoss()
  bce_loss = nn.BCEWithLogitsLoss()

  for p in model.backbone.parameters():
    p.requires_grad = False
    # Optimizer only over heads
  optimizer = torch.optim.AdamW(
    list(model.health_head.parameters()) + list(model.issue_head.parameters()),
    lr=experiment.train.learning_rate,
    weight_decay=experiment.train.weight_decay,
  )

  output_dir = Path(experiment.train.output_dir)
  output_dir.mkdir(parents=True, exist_ok=True)

  for epoch in range(experiment.train.num_epochs):
    model.train()
    total_loss = 0.0

    for images, health_idx, issue_targets in dataloader:
      images = images.to(device)
      health_idx = health_idx.to(device)
      issue_targets = issue_targets.to(device)

      optimizer.zero_grad()

      health_logits, issue_logits = model(images)

      loss_health = ce_loss(health_logits, health_idx)
      loss_issue = bce_loss(issue_logits, issue_targets)
      loss = loss_health + experiment.train.issue_loss_weight * loss_issue

      loss.backward()
      optimizer.step()

      total_loss += loss.item() * images.size(0)

    avg_loss = total_loss / len(dataset)
    print(f"Epoch {epoch + 1}/{experiment.train.num_epochs} - loss: {avg_loss:.4f}")

    # Simple checkpointing
    ckpt_path = output_dir / f"epoch_{epoch + 1}.pt"
    torch.save(
        {
            "model_state_dict": model.state_dict(),
            "health_label_to_idx": health_label_to_idx,
            "issue_label_to_idx": issue_label_to_idx,
            "config": experiment,
        },
        ckpt_path,
    )


if __name__ == "__main__":
  cfg = ExperimentConfig()
  train(cfg)

