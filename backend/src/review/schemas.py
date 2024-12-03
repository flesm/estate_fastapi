from pydantic import BaseModel
from datetime import datetime

class SpecialistReviewBase(BaseModel):
    description: str

class SpecialistReviewCreate(SpecialistReviewBase):
    spec_id: int

class SpecialistReviewOut(SpecialistReviewBase):
    id: int
    time_created: datetime
    user_id: int

    class Config:
        orm_mode = True

class AnalysisReviewBase(BaseModel):
    description: str

class AnalysisReviewCreate(AnalysisReviewBase):
    analysis_id: int

class AnalysisReviewOut(AnalysisReviewBase):
    id: int
    time_created: datetime
    user_id: int

    class Config:
        orm_mode = True
