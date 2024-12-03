from typing import Optional

from pydantic import BaseModel
from datetime import datetime

class AnalysisBase(BaseModel):
    description: str

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisUpdate(AnalysisBase):
    pass

class AnalysisOut(AnalysisBase):
    id: int
    time_created: datetime
    spec_id: int

    class Config:
        orm_mode = True

class AnalysisOut4Users(AnalysisBase):
    id: int
    time_created: datetime
    spec_id: int
    specialist_name: Optional[str] = None

    class Config:
        orm_mode = True
