from pydantic import BaseModel
from datetime import datetime

class SpecialistReviewBase(BaseModel):
    description: str

class SpecialistReviewCreate(SpecialistReviewBase):
    pass

class SpecialistReviewOut(SpecialistReviewBase):
    id: int
    time_created: datetime
    user_id: int

    class Config:
        orm_mode = True

class AnalysisReviewBase(BaseModel):
    description: str

class AnalysisReviewCreate(AnalysisReviewBase):
    pass

class AnalysisReviewOut(AnalysisReviewBase):
    id: int
    time_created: datetime
    user_id: int

    class Config:
        orm_mode = True
