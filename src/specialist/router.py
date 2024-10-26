from typing import AsyncGenerator
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from specialist.schemas import SpecialistCreate
from specialist.models import Specialist
from specialist.service import send_to_crm
from database import get_async_session
from auth.base_config import current_user

router = APIRouter(
    prefix="/specialist",
    tags=["Specialist"],
)


@router.post("/become-specialist", response_model=SpecialistCreate)
async def become_specialist(
        specialist_data: SpecialistCreate,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    new_specialist = Specialist(
        user_id=user.id,
        name=specialist_data.name,
        years_of_experience=specialist_data.years_of_experience,
        photo_url=specialist_data.photo_url,
        description=specialist_data.description,
        email=specialist_data.email,
        phone_number=specialist_data.phone_number,
        social_media_url=specialist_data.social_media_url,
        is_approved=False
    )

    db.add(new_specialist)
    await db.commit()
    await db.refresh(new_specialist)

    crm_success = await send_to_crm(specialist_data.model_dump())
    if not crm_success:
        raise HTTPException(status_code=500, detail="Failed to send data to CRM.")

    return new_specialist