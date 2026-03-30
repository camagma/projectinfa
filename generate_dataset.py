from __future__ import annotations

import json
import random
from pathlib import Path

from ai_algorithm import AIPlanner
from room import Room


def random_room() -> Room:
    room_type = random.choice(["living", "bedroom", "kitchen", "bathroom", "office"])
    style = random.choice(["modern", "scandi", "loft", "classic"])
    width = random.uniform(2.8, 6.5)
    height = random.uniform(2.4, 5.5)
    room = Room.from_rectangle(width_m=width, height_m=height, room_type=room_type, style=style)
    if random.random() < 0.4:
        room.doors.append((random.uniform(0.2, width - 0.4), 0.0))
    return room


def generate_dataset(samples: int = 200, out_path: Path | None = None) -> Path:
    planner = AIPlanner()
    out_path = out_path or Path("data") / "synthetic_dataset.jsonl"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        for _ in range(samples):
            room = random_room()
            result = planner.generate_layout(room, selected_ids=None, max_items=random.randint(6, 12))
            f.write(json.dumps(result.to_dict(), ensure_ascii=False) + "\n")
    return out_path


if __name__ == "__main__":
    path = generate_dataset(samples=200)
    print(f"Dataset saved to {path}")
