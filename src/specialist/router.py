from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from specialist.schemas import SpecialistCreate
from specialist.models import Specialist
from specialist.service import send_to_crm, update_crm_status
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
    # selecting existing spec
    existing_specialist = await db.execute(select(Specialist).where(Specialist.user_id == user.id))
    existing_specialist = existing_specialist.scalars().first()

    # deleting exising spec
    if existing_specialist:
        await db.delete(existing_specialist)
        await db.commit()

    # creating new spec
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

    # sending data to crm
    crm_data = specialist_data.model_dump()
    crm_success = send_to_crm(crm_data)

    if not crm_success:
        raise HTTPException(status_code=500, detail="Failed to send CRM data")

    return new_specialist


@router.post("/approve-specialist/{lead_id}")
async def approve_specialist(lead_id: int):
    success = update_crm_status(lead_id, "APPROVED")
    if not success:
        raise HTTPException(status_code=500, detail="Failed to approve specialist in CRM")
    return {"message": "Specialist approved successfully"}

@router.post("/reject-specialist/{lead_id}")
async def reject_specialist(lead_id: int):
    success = update_crm_status(lead_id, "REJECTED")
    if not success:
        raise HTTPException(status_code=500, detail="Failed to reject specialist in CRM")
    return {"message": "Specialist rejected successfully"}