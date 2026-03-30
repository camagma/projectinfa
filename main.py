from __future__ import annotations

from pathlib import Path

from ai_algorithm import AIPlanner
from room import Room


def main() -> None:
    room = Room.from_rectangle(width_m=4.5, height_m=3.6, room_type="living", style="modern")
    room.doors = [(0.2, 0.0)]

    planner = AIPlanner()
    result = planner.generate_layout(room, selected_ids=["sofa_2", "coffee_table", "tv_stand", "plant_big"])

    output_path = Path("output_layout.json")
    output_path.write_text(result.to_json(), encoding="utf-8")
    print(result.to_json())
    print(f"Saved to {output_path}")


if __name__ == "__main__":
    main()
