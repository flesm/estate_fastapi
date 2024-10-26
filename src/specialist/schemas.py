from pydantic import BaseModel, EmailStr
from typing import Optional

class SpecialistCreate(BaseModel):
    name: str
    years_of_experience: int
    photo_url: Optional[str]
    description: str
    email: EmailStr
    phone_number: Optional[str]
    social_media_url: Optional[str]

class SpecialistRead(SpecialistCreate):
    id: int
    is_approved: bool