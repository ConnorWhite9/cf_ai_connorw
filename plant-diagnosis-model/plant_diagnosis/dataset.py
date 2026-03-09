import json
from pathlib import Path
from typing import List, Dict, Any, Tuple

import torch
from torch.utils.data import Dataset
from PIL import Image
from torchvision import transforms


class PlantDiagnosisDataset(Dataset):
  """
  Dataset that reads:
  - images from data/images/
  - labels from data/labels.jsonl
  and produces:
  - tensor image
  - health_status index
  - multi-hot issue_tags vector
  """

  def __init__(
      self,
      root_dir: str,
      transform=None,
      health_label_to_idx: Dict[str, int] = None,
      issue_label_to_idx: Dict[str, int] = None,
  ):
    self.root = Path(root_dir)
    self.images_dir = self.root / "images"
    self.labels_path = self.root / "labels.jsonl"
    self.transform = transform

    with self.labels_path.open("r") as f:
      self.records: List[Dict[str, Any]] = [json.loads(line) for line in f]

    # If mappings are not provided, infer them from data
    if health_label_to_idx is None:
      health_labels = sorted({r["health_status"] for r in self.records})
      self.health_label_to_idx = {label: i for i, label in enumerate(health_labels)}
    else:
      self.health_label_to_idx = health_label_to_idx

    if issue_label_to_idx is None:
      all_issue_labels = set()
      for r in self.records:
        for tag in r.get("issue_tags", []):
          all_issue_labels.add(tag)
      issue_labels = sorted(all_issue_labels)
      self.issue_label_to_idx = {label: i for i, label in enumerate(issue_labels)}
    else:
      self.issue_label_to_idx = issue_label_to_idx

  def __len__(self) -> int:
    return len(self.records)

  def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int, torch.Tensor]:
    record = self.records[idx]
    img_path = self.images_dir / record["image"]

    image = Image.open(img_path).convert("RGB")
    if self.transform is None:
      self.transform = transforms.Compose(
          [
              transforms.Resize((224, 224)),
              transforms.ToTensor(),
          ]
      )
    image = self.transform(image)

    # Single-label health status
    health_idx = self.health_label_to_idx[record["health_status"]]

    # Multi-label issue tags as multi-hot vector
    num_issue_labels = len(self.issue_label_to_idx)
    issue_targets = torch.zeros(num_issue_labels, dtype=torch.float32)
    for tag in record.get("issue_tags", []):
      if tag in self.issue_label_to_idx:
        issue_targets[self.issue_label_to_idx[tag]] = 1.0

    return image, health_idx, issue_targets

