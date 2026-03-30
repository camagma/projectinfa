from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, List, Tuple

Point = Tuple[float, float]


def polygon_area(points: Iterable[Point]) -> float:
    pts = list(points)
    if len(pts) < 3:
        return 0.0
    area = 0.0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        area += x1 * y2 - x2 * y1
    return abs(area) / 2.0


def point_in_polygon(point: Point, polygon: List[Point]) -> bool:
    x, y = point
    inside = False
    n = len(polygon)
    for i in range(n):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i + 1) % n]
        intersects = ((y1 > y) != (y2 > y)) and (
            x < (x2 - x1) * (y - y1) / (y2 - y1 + 1e-9) + x1
        )
        if intersects:
            inside = not inside
    return inside


@dataclass
class Room:
    polygon: List[Point]
    room_type: str
    style: str
    doors: List[Point] = field(default_factory=list)
    windows: List[Point] = field(default_factory=list)

    @property
    def area_m2(self) -> float:
        # polygon is in meters
        return polygon_area(self.polygon)

    @property
    def bounds(self) -> Tuple[float, float, float, float]:
        xs = [p[0] for p in self.polygon]
        ys = [p[1] for p in self.polygon]
        return min(xs), min(ys), max(xs), max(ys)

    @staticmethod
    def from_rectangle(width_m: float, height_m: float, room_type: str, style: str) -> "Room":
        polygon = [(0.0, 0.0), (width_m, 0.0), (width_m, height_m), (0.0, height_m)]
        return Room(polygon=polygon, room_type=room_type, style=style)

    def contains_rect(self, x: float, y: float, w: float, h: float) -> bool:
        corners = [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
        return all(point_in_polygon(c, self.polygon) for c in corners)
