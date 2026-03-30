from __future__ import annotations

import argparse
import json
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np


def _pick_array(npz: np.lib.npyio.NpzFile, keys: List[str]) -> Optional[np.ndarray]:
    for key in keys:
        if key in npz:
            return npz[key]
    lowered = {k.lower(): k for k in npz.files}
    for key in keys:
        for candidate in lowered:
            if key in candidate:
                return npz[lowered[candidate]]
    return None


def _load_categories(models_info_path: Path, count: int) -> List[str]:
    if not models_info_path.exists():
        return ["unknown"] * count
    try:
        with models_info_path.open("rb") as f:
            info = pickle.load(f)
    except Exception:
        return ["unknown"] * count

    categories: List[str] = []
    if isinstance(info, list):
        for entry in info:
            if isinstance(entry, dict):
                for key in ("category", "coarse_category", "class", "type"):
                    if key in entry:
                        categories.append(str(entry[key]))
                        break
                else:
                    categories.append("unknown")
            else:
                categories.append("unknown")
    else:
        categories = ["unknown"] * count

    if len(categories) < count:
        categories.extend(["unknown"] * (count - len(categories)))
    return categories[:count]


def _infer_room_polygon(translations: np.ndarray, sizes: np.ndarray) -> Tuple[List[List[float]], Tuple[float, float, float, float]]:
    # Use object extents as a proxy for room bounds.
    x_min = float(np.min(translations[:, 0] - sizes[:, 0] / 2))
    x_max = float(np.max(translations[:, 0] + sizes[:, 0] / 2))
    z_min = float(np.min(translations[:, 2] - sizes[:, 2] / 2))
    z_max = float(np.max(translations[:, 2] + sizes[:, 2] / 2))
    polygon = [[x_min, z_min], [x_max, z_min], [x_max, z_max], [x_min, z_max]]
    return polygon, (x_min, z_min, x_max, z_max)


def _normalize(value: float, min_v: float, max_v: float) -> float:
    if max_v - min_v < 1e-6:
        return 0.0
    return (value - min_v) / (max_v - min_v)


def convert_scene(scene_dir: Path) -> Optional[Dict[str, Any]]:
    boxes_path = scene_dir / "boxes.npz"
    if not boxes_path.exists():
        return None

    npz = np.load(boxes_path)
    translations = _pick_array(npz, ["translations", "translation", "trans"])
    sizes = _pick_array(npz, ["sizes", "size", "scales", "scale"])
    angles = _pick_array(npz, ["angles", "angle", "rotations", "rotation", "rots", "rot"])
    labels = _pick_array(npz, ["class_labels", "labels", "classes", "categories"])

    if translations is None or sizes is None:
        return None

    if translations.shape[1] != 3 or sizes.shape[1] != 3:
        return None

    polygon, (x_min, z_min, x_max, z_max) = _infer_room_polygon(translations, sizes)
    width = max(x_max - x_min, 1e-6)
    depth = max(z_max - z_min, 1e-6)

    room_type = "unknown"
    if "_" in scene_dir.parent.name:
        room_type = scene_dir.parent.name.split("_", 2)[-1]

    categories = _load_categories(scene_dir / "models_info.pkl", translations.shape[0])
    objects = []
    for i in range(translations.shape[0]):
        tx, _, tz = translations[i]
        sx, _, sz = sizes[i]
        rot = float(angles[i][0]) if angles is not None and angles.ndim > 1 else float(angles[i]) if angles is not None else 0.0
        label = categories[i]
        if labels is not None:
            label = str(labels[i])

        x = _normalize(tx - sx / 2, x_min, x_max)
        y = _normalize(tz - sz / 2, z_min, z_max)
        w = float(sx / width)
        h = float(sz / depth)
        objects.append(
            {
                "category": label,
                "x": float(x),
                "y": float(y),
                "w": w,
                "h": h,
                "rot": float(rot),
            }
        )

    return {
        "room_type": room_type,
        "room_polygon": [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
        "objects": objects,
        "source": str(scene_dir),
    }


def build_dataset(root: Path, out_path: Path, limit: Optional[int], room_type: Optional[str]) -> int:
    count = 0
    with out_path.open("w", encoding="utf-8") as f:
        for scene_dir in root.rglob("boxes.npz"):
            scene_path = scene_dir.parent
            if room_type and room_type not in scene_path.parent.name:
                continue
            record = convert_scene(scene_path)
            if not record:
                continue
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
            count += 1
            if limit and count >= limit:
                break
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert InstructScene/3D-FRONT preprocessed data into 2D JSONL.")
    parser.add_argument("--root", type=Path, required=True, help="Path to InstructScene dataset root")
    parser.add_argument("--out", type=Path, default=Path("data") / "instructscene_2d.jsonl")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--room-type", type=str, default=None, help="Filter by room type, e.g. bedroom, livingroom")
    args = parser.parse_args()

    out_path = args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)
    count = build_dataset(args.root, out_path, args.limit, args.room_type)
    print(f"Wrote {count} scenes to {out_path}")


if __name__ == "__main__":
    main()
