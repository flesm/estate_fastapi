from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from auth.models import Role, User
from specialist.schemas import SpecialistCreate
from specialist.models import Specialist
from database import get_async_session
from auth.base_config import current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/specialist-requests", response_model=List[SpecialistCreate])
async def list_specialist_requests(
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    role = await db.get(Role, user.role_id)
    if not role or not role.can_edit_user_data:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(select(Specialist).where(Specialist.is_approved == False))
    specialists = result.scalars().all()
    return specialists


@router.patch("/approve-specialist/{specialist_id}")
async def approve_specialist(
        specialist_id: int,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    role = await db.get(Role, user.role_id)
    if not role or not role.can_edit_user_data:
        raise HTTPException(status_code=403, detail="Not authorized")

    specialist = await db.get(Specialist, specialist_id)
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    specialist.is_approved = True
    await db.commit()
    await db.refresh(specialist)

    user = await db.get(User,  specialist.user_id)
    user.role_id = 3
    await db.commit()

    return {"message": "Specialist approved successfully"}