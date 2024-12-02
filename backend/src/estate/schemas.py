from pydantic import BaseModel
from typing import Optional

class EstateBaseSchema(BaseModel):
    area_total: float
    floor_number: int
    total_floors: Optional[int] = None
    building_type: str
    year_built: Optional[int] = None
    ceiling_height: Optional[float] = None
    has_balcony: Optional[bool] = None
    condition: Optional[str] = None
    address: str
    heating: Optional[str] = None
    water_supply: Optional[bool] = None
    sewerage: Optional[bool] = None
    electricity: Optional[bool] = None
    gas: Optional[bool] = None
    internet: Optional[bool] = None

    class Config:
        orm_mode = True

class EstateCreateSchema(EstateBaseSchema):
    pass

class EstateUpdateSchema(EstateBaseSchema):
    area_total: Optional[float] = None
    floor_number: Optional[int] = None
    total_floors: Optional[int] = None
    building_type: Optional[str] = None
    year_built: Optional[int] = None
    ceiling_height: Optional[float] = None
    has_balcony: Optional[bool] = None
    condition: Optional[str] = None
    address: Optional[str] = None
    heating: Optional[str] = None
    water_supply: Optional[bool] = None
    sewerage: Optional[bool] = None
    electricity: Optional[bool] = None
    gas: Optional[bool] = None
    internet: Optional[bool] = None

class EstateReadSchema(EstateBaseSchema):
    id: int
    user_id: int
