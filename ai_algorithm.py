from __future__ import annotations

import json
import math
import random
from pathlib import Path
from dataclasses import dataclass, field
from typing import Dict, Iterable, List, Optional, Tuple

from furniture import FURNITURE_DB, FurnitureItem, by_ids
from layout_db import LAYOUT_DB
from room import Room

try:
    import torch
    import torch.nn as nn
except Exception:  # pragma: no cover - optional dependency
    torch = None
    nn = None


@dataclass
class Placement:
    item: FurnitureItem
    x: float
    y: float
    w: float
    h: float
    rotation_deg: int
    score: float = 0.0

    @property
    def rect(self) -> Tuple[float, float, float, float]:
        return self.x, self.y, self.w, self.h


def rects_intersect(a: Tuple[float, float, float, float], b: Tuple[float, float, float, float]) -> bool:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return not (
        ax + aw <= bx
        or bx + bw <= ax
        or ay + ah <= by
        or by + bh <= ay
    )


def frange(start: float, stop: float, step: float) -> Iterable[float]:
    x = start
    while x <= stop + 1e-9:
        yield x
        x += step


class FurnitureAI:
    def __init__(self) -> None:
        self.room_type_weights: Dict[str, Dict[str, float]] = {
            "living": {"sofa": 4.0, "armchair": 2.0, "tv_stand": 2.5, "coffee_table": 2.0, "plant": 1.0},
            "bedroom": {"bed": 4.5, "wardrobe": 3.0, "nightstand": 2.0, "dresser": 1.5, "plant": 0.5},
            "kitchen": {"dining_table": 3.0, "chair": 2.0, "kitchen_cabinet": 4.0, "appliance": 3.5},
            "bathroom": {"shower": 4.0, "toilet": 3.5, "vanity": 3.0, "mirror": 1.5},
            "office": {"desk": 4.0, "chair": 3.5, "bookcase": 2.0, "lamp": 1.0},
            "hall": {"bench": 2.5, "storage": 3.0},
        }
        self.style_bonus = {
            "modern": 1.0,
            "scandi": 1.0,
            "loft": 0.8,
            "classic": 0.7,
        }

    def score_item(self, room: Room, item: FurnitureItem) -> float:
        score = 0.0
        score += self.room_type_weights.get(room.room_type, {}).get(item.category, 0.3)
        for style in item.styles:
            if style == room.style:
                score += self.style_bonus.get(style, 0.5)
        area = room.area_m2
        size_m2 = (item.width_cm / 100) * (item.depth_cm / 100)
        if area < 10 and size_m2 > 2.5:
            score -= 1.5
        if area > 20 and size_m2 < 0.4:
            score -= 0.3
        return score

    def recommend(self, room: Room, limit: int = 10) -> List[FurnitureItem]:
        ranked = sorted(FURNITURE_DB, key=lambda item: self.score_item(room, item), reverse=True)
        # keep items relevant to room type first
        primary = [item for item in ranked if room.room_type in item.tags]
        secondary = [item for item in ranked if room.room_type not in item.tags]
        return (primary + secondary)[:limit]


class TemplatePlacementModel:
    def pick_template(self, room: Room) -> Optional[dict]:
        for template in LAYOUT_DB:
            if template["room_type"] != room.room_type:
                continue
            if template["min_area"] <= room.area_m2 <= template["max_area"]:
                return template
        return None

    def apply_template(self, room: Room, selected_items: List[FurnitureItem]) -> Optional[List[Placement]]:
        template = self.pick_template(room)
        if not template:
            return None
        min_x, min_y, max_x, max_y = room.bounds
        width = max_x - min_x
        height = max_y - min_y
        selected_ids = {item.id for item in selected_items}
        placements: List[Placement] = []
        for item_tpl in template["items"]:
            if item_tpl["id"] not in selected_ids:
                continue
            item = next(i for i in selected_items if i.id == item_tpl["id"])
            w = item_tpl["w"] * width
            h = item_tpl["h"] * height
            x = min_x + item_tpl["x"] * width
            y = min_y + item_tpl["y"] * height
            placements.append(Placement(item=item, x=x, y=y, w=w, h=h, rotation_deg=item_tpl.get("rot", 0)))
        return placements


class SmartPlacementAI:
    def __init__(self, grid_step_m: float = 0.25) -> None:
        self.grid_step_m = grid_step_m
        self.category_preferences = {
            "bed": "wall",
            "sofa": "wall",
            "wardrobe": "wall",
            "tv_stand": "wall",
            "shower": "wall",
            "kitchen_cabinet": "wall",
            "dining_table": "center",
            "desk": "center",
            "coffee_table": "center",
        }

    def place_items(
        self,
        room: Room,
        items: List[FurnitureItem],
        randomize: bool = False,
        seed: Optional[int] = None,
    ) -> Tuple[List[Placement], List[str]]:
        min_x, min_y, max_x, max_y = room.bounds
        placements: List[Placement] = []
        warnings: List[str] = []

        def is_free(rect: Tuple[float, float, float, float]) -> bool:
            return all(not rects_intersect(rect, p.rect) for p in placements)

        if randomize:
            rng = random.Random(seed)
            items_sorted = sorted(
                items,
                key=lambda i: (i.width_cm * i.depth_cm, rng.random()),
                reverse=True,
            )
        else:
            items_sorted = sorted(items, key=lambda i: (i.width_cm * i.depth_cm), reverse=True)

        for item in items_sorted:
            best: Optional[Placement] = None
            rotations = [0, 90] if item.can_rotate else [0]
            for rot in rotations:
                w = item.width_cm / 100
                h = item.depth_cm / 100
                if rot == 90:
                    w, h = h, w
                for x in frange(min_x, max_x - w, self.grid_step_m):
                    for y in frange(min_y, max_y - h, self.grid_step_m):
                        if not room.contains_rect(x, y, w, h):
                            continue
                        rect = (x, y, w, h)
                        if not is_free(rect):
                            continue
                        score = self._score_candidate(room, item, rect)
                        if best is None or score > best.score:
                            best = Placement(item=item, x=x, y=y, w=w, h=h, rotation_deg=rot, score=score)
            if best:
                placements.append(best)
            else:
                warnings.append(f"No space for {item.name}")
        return placements, warnings

    def _score_candidate(self, room: Room, item: FurnitureItem, rect: Tuple[float, float, float, float]) -> float:
        min_x, min_y, max_x, max_y = room.bounds
        x, y, w, h = rect
        center = (x + w / 2, y + h / 2)
        # distance to walls
        wall_dist = min(x - min_x, y - min_y, max_x - (x + w), max_y - (y + h))
        wall_dist = max(wall_dist, 0.0)

        pref = self.category_preferences.get(item.category, "flex")
        if pref == "wall":
            score = 2.0 - wall_dist
        elif pref == "center":
            cx = (min_x + max_x) / 2
            cy = (min_y + max_y) / 2
            score = 2.0 - math.dist(center, (cx, cy))
        else:
            score = 1.0

        for door in room.doors:
            if math.dist(center, door) < 0.9:
                score -= 1.2
        return score


class GNNCompatibilityModel(nn.Module):
    def __init__(self, in_dim: int, hidden_dim: int = 32) -> None:
        super().__init__()
        self.fc1 = nn.Linear(in_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, hidden_dim)

    def forward(self, x: torch.Tensor, adj: torch.Tensor) -> torch.Tensor:
        # simple GCN-like layer without external deps
        deg = torch.sum(adj, dim=1, keepdim=True).clamp(min=1.0)
        h = torch.matmul(adj, x) / deg
        h = torch.relu(self.fc1(h))
        h = torch.matmul(adj, h) / deg
        h = torch.relu(self.fc2(h))
        return h


class GNNScorer:
    def __init__(self, model_path: Path | str = Path("models") / "gnn.pt") -> None:
        if torch is None or nn is None:
            raise RuntimeError("PyTorch not available")
        model_path = Path(model_path)
        if not model_path.exists():
            raise FileNotFoundError(f"Model not found: {model_path}")
        checkpoint = torch.load(model_path, map_location="cpu")
        cat_map = checkpoint.get("cat_map")
        if not isinstance(cat_map, dict):
            raise ValueError("Invalid model checkpoint: cat_map missing")
        self.cat_map = {str(k): int(v) for k, v in cat_map.items()}
        self.model = GNNCompatibilityModel(in_dim=len(self.cat_map) + 1)
        self.model.load_state_dict(checkpoint["state_dict"])
        self.model.eval()

    def _distance_threshold(self, placements: List[Placement]) -> float:
        max_coord = 0.0
        for p in placements:
            max_coord = max(max_coord, p.x + p.w, p.y + p.h)
        return 0.25 if max_coord <= 1.5 else 1.0

    def score(self, placements: List[Placement]) -> float:
        if len(placements) < 2:
            return 0.0

        features = []
        centers = []
        for p in placements:
            one_hot = [0.0] * len(self.cat_map)
            idx = self.cat_map.get(p.item.category, self.cat_map.get("unknown", 0))
            one_hot[idx] = 1.0
            size = max(p.w, 0.0) * max(p.h, 0.0)
            features.append(one_hot + [size])
            centers.append((p.x + p.w / 2, p.y + p.h / 2))

        n = len(placements)
        adj = torch.zeros((n, n), dtype=torch.float32)
        threshold = self._distance_threshold(placements)
        for i in range(n):
            for j in range(i + 1, n):
                dist = math.dist(centers[i], centers[j])
                if dist < threshold:
                    adj[i, j] = 1.0
                    adj[j, i] = 1.0
        adj += torch.eye(n)

        x = torch.tensor(features, dtype=torch.float32)
        with torch.no_grad():
            h = self.model(x, adj)
        pair_scores = []
        for i in range(n):
            for j in range(i + 1, n):
                if adj[i, j] > 0:
                    pair_scores.append((h[i] * h[j]).sum())
        if not pair_scores:
            return 0.0
        return float(torch.stack(pair_scores).mean().item())


@dataclass
class LayoutResult:
    room: Room
    placements: List[Placement]
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "room": {
                "room_type": self.room.room_type,
                "style": self.room.style,
                "polygon": self.room.polygon,
                "area_m2": self.room.area_m2,
            },
            "placements": [
                {
                    "id": p.item.id,
                    "name": p.item.name,
                    "x": p.x,
                    "y": p.y,
                    "w": p.w,
                    "h": p.h,
                    "rot": p.rotation_deg,
                }
                for p in self.placements
            ],
            "warnings": self.warnings,
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)


class AIPlanner:
    def __init__(self) -> None:
        self.recommender = FurnitureAI()
        self.template_model = TemplatePlacementModel()
        self.placement_model = SmartPlacementAI()
        self.gnn_scorer: Optional[GNNScorer] = None
        try:
            self.gnn_scorer = GNNScorer()
        except Exception:
            self.gnn_scorer = None

    def generate_layout(
        self,
        room: Room,
        selected_ids: Optional[List[str]] = None,
        max_items: int = 10,
        use_gnn: bool = True,
    ) -> LayoutResult:
        if selected_ids:
            items = by_ids(selected_ids)
        else:
            items = self.recommender.recommend(room, limit=max_items)

        template_placements = self.template_model.apply_template(room, items)
        warnings: List[str] = []

        if use_gnn and self.gnn_scorer:
            best_placements = template_placements
            best_warnings: List[str] = []
            best_score = self.gnn_scorer.score(template_placements) if template_placements else None

            baseline, base_warn = self.placement_model.place_items(room, items)
            base_score = self.gnn_scorer.score(baseline)
            if best_score is None or base_score > best_score:
                best_placements = baseline
                best_warnings = base_warn
                best_score = base_score

            for attempt in range(4):
                candidate, cand_warn = self.placement_model.place_items(
                    room,
                    items,
                    randomize=True,
                    seed=attempt + 1,
                )
                cand_score = self.gnn_scorer.score(candidate)
                if best_score is None or cand_score > best_score:
                    best_placements = candidate
                    best_warnings = cand_warn
                    best_score = cand_score

            placements = best_placements if best_placements is not None else baseline
            warnings = best_warnings
        else:
            placements = template_placements
            if placements is None or len(placements) < len(items) // 2:
                placements, warnings = self.placement_model.place_items(room, items)

        return LayoutResult(room=room, placements=placements, warnings=warnings)


def simple_chat_response(message: str) -> str:
    text = message.lower().strip()
    if not text:
        return "Введіть повідомлення."
    if "рослин" in text or "plant" in text:
        return "Я можу додати рослину біля вікна або в куті кімнати."
    if "стиль" in text:
        return "Порада: у сучасному стилі краще використовувати нейтральні кольори та прості форми."
    if "світло" in text or "освіт" in text:
        return "Додайте настільну лампу біля робочого місця або торшер у вітальні."
    return "Готово! Якщо хочете, підкажіть стиль або бюджет."
