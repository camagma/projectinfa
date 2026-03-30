from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Dict, List, Tuple, Optional

import torch
import torch.nn as nn

from ai_algorithm import GNNCompatibilityModel
from furniture import FURNITURE_DB, by_id


def load_dataset(path: Path) -> List[dict]:
    data = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            data.append(json.loads(line))
    return data


def extract_objects(sample: dict) -> List[dict]:
    if "objects" in sample:
        return sample.get("objects", [])
    if "placements" in sample:
        objects = []
        for p in sample.get("placements", []):
            item = by_id(p.get("id", ""))
            category = item.category if item else "unknown"
            objects.append(
                {
                    "category": category,
                    "x": p.get("x", 0.0),
                    "y": p.get("y", 0.0),
                    "w": p.get("w", 0.0),
                    "h": p.get("h", 0.0),
                    "rot": p.get("rot", 0.0),
                }
            )
        return objects
    return []


def build_feature_map(data: List[dict]) -> Dict[str, int]:
    categories = {item.category for item in FURNITURE_DB}
    for sample in data:
        for obj in extract_objects(sample):
            if "category" in obj:
                categories.add(str(obj["category"]))
    categories.add("unknown")
    categories = sorted(categories)
    return {cat: idx for idx, cat in enumerate(categories)}


def _distance_threshold(objs: List[dict]) -> float:
    if not objs:
        return 1.0
    max_coord = 0.0
    for obj in objs:
        max_coord = max(max_coord, obj.get("x", 0.0) + obj.get("w", 0.0))
        max_coord = max(max_coord, obj.get("y", 0.0) + obj.get("h", 0.0))
    return 0.25 if max_coord <= 1.5 else 1.0


def build_graph(sample: dict, cat_map: Dict[str, int]) -> Tuple[torch.Tensor, torch.Tensor, List[Tuple[int, int]]]:
    objects = extract_objects(sample)
    n = len(objects)
    if n == 0:
        return torch.empty(0), torch.empty(0), []

    features = []
    centers = []
    for obj in objects:
        category = str(obj.get("category", "unknown"))
        one_hot = [0.0] * len(cat_map)
        cat_idx = cat_map.get(category, cat_map.get("unknown", 0))
        one_hot[cat_idx] = 1.0
        size = max(obj.get("w", 0.0), 0.0) * max(obj.get("h", 0.0), 0.0)
        features.append(one_hot + [size])
        centers.append(
            (
                obj.get("x", 0.0) + obj.get("w", 0.0) / 2,
                obj.get("y", 0.0) + obj.get("h", 0.0) / 2,
            )
        )

    adj = torch.zeros((n, n), dtype=torch.float32)
    pos_edges = []
    threshold = _distance_threshold(objects)
    for i in range(n):
        for j in range(i + 1, n):
            dist = ((centers[i][0] - centers[j][0]) ** 2 + (centers[i][1] - centers[j][1]) ** 2) ** 0.5
            if dist < threshold:
                adj[i, j] = 1.0
                adj[j, i] = 1.0
                pos_edges.append((i, j))
    adj += torch.eye(n)
    return torch.tensor(features, dtype=torch.float32), adj, pos_edges


def train(dataset_path: Path, epochs: int = 80, lr: float = 1e-2) -> Path:
    data = load_dataset(dataset_path)
    cat_map = build_feature_map(data)
    in_dim = len(cat_map) + 1
    model = GNNCompatibilityModel(in_dim=in_dim)
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    loss_fn = nn.BCEWithLogitsLoss()

    for epoch in range(epochs):
        total_loss = 0.0
        steps = 0
        skipped = 0
        random.shuffle(data)
        for sample in data:
            x, adj, pos_edges = build_graph(sample, cat_map)
            if x.numel() == 0 or not pos_edges:
                skipped += 1
                continue
            h = model(x, adj)
            # positive pairs
            pos_scores = []
            pos_labels = []
            for i, j in pos_edges:
                pos_scores.append((h[i] * h[j]).sum())
                pos_labels.append(1.0)
            # negative sampling
            neg_scores = []
            neg_labels = []
            n = h.shape[0]
            tries = 0
            while len(neg_scores) < len(pos_scores) and tries < n * n:
                i = random.randrange(n)
                j = random.randrange(n)
                if i == j or adj[i, j] > 0.0:
                    tries += 1
                    continue
                neg_scores.append((h[i] * h[j]).sum())
                neg_labels.append(0.0)
                tries += 1

            scores = torch.stack(pos_scores + neg_scores)
            labels = torch.tensor(pos_labels + neg_labels, dtype=torch.float32)
            loss = loss_fn(scores, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            steps += 1
        if epoch % 10 == 0:
            avg = total_loss / max(steps, 1)
            print(f"Epoch {epoch} avg_loss={avg:.4f} steps={steps} skipped={skipped}")

    out_path = Path("models") / "gnn.pt"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    torch.save({"state_dict": model.state_dict(), "cat_map": cat_map, "dataset": str(dataset_path)}, out_path)
    return out_path


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Train GNN compatibility model for 2D layouts.")
    parser.add_argument("--dataset", type=Path, default=None)
    parser.add_argument("--epochs", type=int, default=80)
    parser.add_argument("--lr", type=float, default=3e-3)
    args = parser.parse_args()

    if args.dataset is None:
        instruct = Path("data") / "instructscene_2d.jsonl"
        synthetic = Path("data") / "synthetic_dataset.jsonl"
        dataset = instruct if instruct.exists() else synthetic
    else:
        dataset = args.dataset

    if not dataset.exists():
        raise SystemExit("Dataset not found. Generate it first.")
    path = train(dataset, epochs=args.epochs, lr=args.lr)
    print(f"Saved model to {path}")
