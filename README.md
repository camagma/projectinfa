# Datasets (2D layout)

This project targets 2D furniture layout learning using preprocessed 3D-FRONT data from InstructScene.

## Recommended source (educational use)
- Hugging Face dataset: `chenguolin/InstructScene_dataset`
- It contains 3D-FRONT/3D-FUTURE scene data and per-scene `boxes.npz` with object translations, sizes, and rotations.
- Download instructions and folder structure are documented in the InstructScene repo dataset README.

## Build the 2D JSONL dataset

1. Download and unpack the dataset following the InstructScene dataset README.
2. Run:

```bash
python prepare_instructscene_2d.py --root <PATH_TO_INSTRUCTSCENE_DATASET> --out data/instructscene_2d.jsonl
```

Optional filters:
- `--room-type bedroom`
- `--limit 500`

## Output format (JSONL)

Each line:
- `room_type`: room class (from folder name)
- `room_polygon`: normalized rectangle placeholder
- `objects`: list of `{category, x, y, w, h, rot}`
- `source`: scene folder path for traceability
