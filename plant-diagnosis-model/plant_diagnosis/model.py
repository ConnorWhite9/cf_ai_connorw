from typing import Tuple

import torch
import torch.nn as nn
import timm


class PlantDiagnosisNet(nn.Module):
  """
  ConvNeXt-based multi-task model:
  - health_status: single-label classification (softmax at inference)
  - issue_tags: multi-label classification (sigmoid at inference)
  """

  def __init__(
      self,
      backbone_name: str,
      num_health_classes: int,
      num_issue_labels: int,
  ):
    super().__init__()
    self.backbone = timm.create_model(
        backbone_name,
        pretrained=True,
        num_classes=0,  # get features only
    )
    feat_dim = self.backbone.num_features

    self.health_head = nn.Linear(feat_dim, num_health_classes)
    self.issue_head = nn.Linear(feat_dim, num_issue_labels)

  def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
    feats = self.backbone(x)
    health_logits = self.health_head(feats)
    issue_logits = self.issue_head(feats)
    return health_logits, issue_logits

