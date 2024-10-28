from pydantic import BaseModel
from datetime import datetime
from estate.schemas import EstateReadSchema

class ReportReadSchema(BaseModel):
    id: int
    estimated_value: float
    price_per_sqm: float
    created_at: datetime
    estate: EstateReadSchema


    class Config:
        orm_mode = True