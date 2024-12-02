from pydantic import BaseModel, HttpUrl, EmailStr


class RoleCheckResponse(BaseModel):
    role_id: int

from pydantic import BaseModel
from typing import Optional

class SpecialistCreate(BaseModel):
    id: int
    user_id: int
    is_approved: bool
    name: str
    years_of_experience: int
    photo_url: str
    description: Optional[str]
    email: str
    phone_number: str
    social_media_url: Optional[str]

    class Config:
        orm_mode = True


class SpecialistInfo(BaseModel):
    name: Optional[str]
    phone_number: Optional[str]
    social_media_url: Optional[str]

    class Config:
        orm_mode = True

class UserResponse(BaseModel):
    id: int
    email: str
    role_id: int
    specialist: Optional[SpecialistInfo]

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    id: int
    email: str
    role: int  # 2 - обычный пользователь, 3 - специалист

class SpecialistBase(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    social_media_url: Optional[str] = None

class UserResponseSpec(UserBase):
    specialist: SpecialistBase

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    specialist: Optional[SpecialistBase] = None

class AdminCreate(BaseModel):
    email: str
    password: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = True
    is_verified: Optional[bool] = True
    role_id: int = 4

class AdminResponse(BaseModel):
    id: int
    email: str
    role_id: int