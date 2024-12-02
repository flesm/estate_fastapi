from pydantic import BaseModel
from datetime import datetime
from estate.schemas import EstateReadSchema

class ReportBaseSchema(BaseModel):
    estimated_value: float
    price_per_sqm: float
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class ReportReadSchema(ReportBaseSchema):
    id: int
    estate: EstateReadSchema
