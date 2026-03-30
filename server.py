from __future__ import annotations

from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ai_algorithm import AIPlanner
from room import Room


class LayoutRequest(BaseModel):
    width: float
    height: float
    room_type: str
    style: str = "modern"
    selected_ids: Optional[List[str]] = None
    use_gnn: bool = True
    doors: Optional[List[List[float]]] = None
    polygon: Optional[List[List[float]]] = None
    windows: Optional[List[List[float]]] = None


class LayoutResponse(BaseModel):
    room: dict
    placements: list
    warnings: list


app = FastAPI(title="Planning.AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

planner = AIPlanner()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/layout", response_model=LayoutResponse)
def layout(req: LayoutRequest) -> dict:
    if req.polygon and len(req.polygon) >= 3:
        polygon = [(float(x), float(y)) for x, y in req.polygon]
        room = Room(polygon=polygon, room_type=req.room_type, style=req.style)
    else:
        room = Room.from_rectangle(width_m=req.width, height_m=req.height, room_type=req.room_type, style=req.style)
    if req.doors:
        room.doors = [(float(x), float(y)) for x, y in req.doors]
    if req.windows:
        room.windows = [(float(x), float(y)) for x, y in req.windows]
    result = planner.generate_layout(
        room,
        selected_ids=req.selected_ids,
        max_items=10,
        use_gnn=req.use_gnn,
    )
    return result.to_dict()
