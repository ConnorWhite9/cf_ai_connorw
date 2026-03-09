from dataclasses import dataclass
from typing import List


@dataclass
class DataConfig:
  root_dir: str = "data"
  images_subdir: str = "images"
  labels_file: str = "labels.jsonl"
  image_size: int = 224


@dataclass
class ModelConfig:
  backbone_name: str = "convnext_tiny.fb_in22k_ft_in1k"
  num_health_classes: int = 3
  issue_labels: List[str] = None  # to be populated at runtime from data


@dataclass
class TrainConfig:
  batch_size: int = 32
  num_epochs: int = 20
  learning_rate: float = 3e-4
  weight_decay: float = 1e-4
  issue_loss_weight: float = 1.0
  num_workers: int = 4
  output_dir: str = "checkpoints"


@dataclass
class ExperimentConfig:
  data: DataConfig = DataConfig()
  model: ModelConfig = ModelConfig()
  train: TrainConfig = TrainConfig()

