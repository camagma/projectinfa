from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, List


@dataclass(frozen=True)
class FurnitureItem:
    id: str
    name: str
    category: str
    width_cm: int
    depth_cm: int
    height_cm: int
    styles: List[str] = field(default_factory=list)
    price_usd: int = 0
    can_rotate: bool = True
    tags: List[str] = field(default_factory=list)


FURNITURE_DB: List[FurnitureItem] = [
    FurnitureItem("ikea_klippan", "IKEA KLIPPAN 2-seat sofa", "sofa", 180, 88, 66, ["modern", "classic"], 0, True, ["living"]),
    FurnitureItem("ikea_lack", "IKEA LACK coffee table", "coffee_table", 90, 55, 45, ["modern", "scandi"], 0, True, ["living", "kitchen"]),
    FurnitureItem("ikea_malm", "IKEA MALM bed frame", "bed", 209, 176, 100, ["modern", "classic"], 0, True, ["bedroom"]),
    FurnitureItem("ikea_billy", "IKEA BILLY bookcase", "bookcase", 80, 28, 202, ["modern", "scandi"], 0, True, ["living", "bedroom", "office"]),
    FurnitureItem("jysk_hovslund", "JYSK HOVSLUND coffee table", "coffee_table", 110, 60, 45, ["modern", "scandi"], 0, True, ["living", "kitchen"]),
    FurnitureItem("jysk_abildro", "JYSK ABILDRO bed frame", "bed", 200, 90, 85, ["modern"], 0, True, ["bedroom"]),
    FurnitureItem("ikea_poang", "IKEA POÄNG armchair", "armchair", 68, 82, 100, ["modern", "classic"], 0, True, ["living", "bedroom"]),
    FurnitureItem("ikea_micke", "IKEA MICKE desk", "desk", 105, 50, 75, ["modern"], 0, True, ["office", "bedroom"]),
    FurnitureItem("ikea_linnmon", "IKEA LINNMON/ADILS desk", "desk", 100, 60, 75, ["modern"], 0, True, ["office", "bedroom"]),
    FurnitureItem("ikea_hemnes_dresser", "IKEA HEMNES 3-drawer dresser", "dresser", 58, 79, 78, ["classic", "modern"], 0, True, ["bedroom"]),
    FurnitureItem("ikea_kallax", "IKEA KALLAX shelf unit", "bookcase", 147, 39, 147, ["modern", "scandi"], 0, True, ["living", "bedroom", "office"]),
    FurnitureItem("sofa_2", "Sofa 2-seat", "sofa", 180, 90, 85, ["modern", "scandi"], 450, True, ["living"]),
    FurnitureItem("sofa_3", "Sofa 3-seat", "sofa", 220, 95, 90, ["modern", "loft"], 620, True, ["living"]),
    FurnitureItem("sectional_l", "Sectional L", "sofa", 260, 190, 90, ["modern"], 980, True, ["living"]),
    FurnitureItem("armchair", "Armchair", "armchair", 90, 85, 90, ["scandi", "classic"], 220, True, ["living"]),
    FurnitureItem("coffee_table", "Coffee Table", "coffee_table", 110, 60, 40, ["modern", "scandi"], 120, True, ["living"]),
    FurnitureItem("tv_stand", "TV Stand", "tv_stand", 160, 40, 55, ["modern"], 180, True, ["living"]),
    FurnitureItem("bookshelf", "Bookshelf", "bookcase", 90, 35, 190, ["loft", "classic"], 160, True, ["living", "office"]),
    FurnitureItem("bed_queen", "Bed Queen", "bed", 200, 160, 90, ["modern", "classic"], 520, True, ["bedroom"]),
    FurnitureItem("bed_king", "Bed King", "bed", 210, 180, 95, ["modern"], 680, True, ["bedroom"]),
    FurnitureItem("nightstand", "Nightstand", "nightstand", 45, 40, 55, ["modern", "scandi"], 60, True, ["bedroom"]),
    FurnitureItem("wardrobe", "Wardrobe", "wardrobe", 160, 60, 210, ["modern", "classic"], 430, True, ["bedroom"]),
    FurnitureItem("dresser", "Dresser", "dresser", 120, 50, 80, ["classic", "scandi"], 210, True, ["bedroom"]),
    FurnitureItem("desk", "Desk", "desk", 140, 70, 75, ["modern"], 180, True, ["office"]),
    FurnitureItem("office_chair", "Office Chair", "chair", 65, 65, 110, ["modern"], 150, True, ["office"]),
    FurnitureItem("desk_lamp", "Desk Lamp", "lamp", 20, 20, 45, ["modern"], 30, False, ["office"]),
    FurnitureItem("dining_table_4", "Dining Table 4p", "dining_table", 140, 80, 75, ["modern", "scandi"], 240, True, ["kitchen"]),
    FurnitureItem("dining_table_6", "Dining Table 6p", "dining_table", 180, 90, 75, ["modern"], 320, True, ["kitchen"]),
    FurnitureItem("dining_chair", "Dining Chair", "chair", 45, 50, 90, ["scandi", "modern"], 60, True, ["kitchen"]),
    FurnitureItem("kitchen_base", "Kitchen Base Cabinet", "kitchen_cabinet", 80, 60, 90, ["modern"], 140, False, ["kitchen"]),
    FurnitureItem("kitchen_sink", "Sink Cabinet", "kitchen_cabinet", 80, 60, 90, ["modern"], 160, False, ["kitchen"]),
    FurnitureItem("fridge", "Refrigerator", "appliance", 70, 70, 190, ["modern"], 700, False, ["kitchen"]),
    FurnitureItem("stove", "Stove", "appliance", 60, 60, 85, ["modern"], 450, False, ["kitchen"]),
    FurnitureItem("shower", "Shower Cabin", "shower", 90, 90, 210, ["modern"], 420, False, ["bathroom"]),
    FurnitureItem("toilet", "Toilet", "toilet", 70, 40, 80, ["modern"], 180, False, ["bathroom"]),
    FurnitureItem("vanity", "Vanity", "vanity", 80, 50, 85, ["modern", "classic"], 220, True, ["bathroom"]),
    FurnitureItem("mirror", "Mirror", "mirror", 60, 5, 80, ["modern"], 50, False, ["bathroom"]),
    FurnitureItem("plant_small", "Plant Small", "plant", 35, 35, 80, ["scandi", "modern"], 25, False, ["living", "bedroom"]),
    FurnitureItem("plant_big", "Plant Big", "plant", 60, 60, 150, ["modern"], 60, False, ["living"]),
    FurnitureItem("bench", "Bench", "bench", 120, 45, 45, ["scandi"], 110, True, ["hall"]),
    FurnitureItem("shoe_rack", "Shoe Rack", "storage", 80, 30, 45, ["modern"], 70, True, ["hall"]),
    FurnitureItem("coat_rack", "Coat Rack", "storage", 60, 60, 170, ["modern"], 90, False, ["hall"]),
    FurnitureItem("side_table", "Side Table", "side_table", 50, 50, 55, ["modern", "scandi"], 55, True, ["living", "bedroom"]),
    FurnitureItem("media_console", "Media Console", "tv_stand", 180, 45, 55, ["loft"], 220, True, ["living"]),
    FurnitureItem("crib", "Crib", "bed", 125, 70, 95, ["modern"], 230, True, ["bedroom"]),
    FurnitureItem("floor_lamp", "Floor Lamp", "lamp", 30, 30, 150, ["modern"], 85, False, ["living", "bedroom", "office"]),
    FurnitureItem("wall_shelf", "Wall Shelf", "bookcase", 80, 25, 25, ["modern"], 70, False, ["living", "bedroom"]),
    FurnitureItem("bar_stool", "Bar Stool", "chair", 40, 40, 75, ["modern"], 45, True, ["kitchen"]),
    FurnitureItem("kitchen_island", "Kitchen Island", "kitchen_cabinet", 120, 80, 90, ["modern"], 320, False, ["kitchen"]),
]


def by_id(item_id: str) -> FurnitureItem | None:
    for item in FURNITURE_DB:
        if item.id == item_id:
            return item
    return None


def by_ids(item_ids: Iterable[str]) -> List[FurnitureItem]:
    found = []
    for item_id in item_ids:
        item = by_id(item_id)
        if item:
            found.append(item)
    return found
