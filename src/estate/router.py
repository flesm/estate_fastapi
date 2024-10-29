from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from auth.base_config import current_user
from database import get_async_session
from estate.models import Estate
from estate.schemas import EstateCreateSchema, EstateReadSchema

router = APIRouter(
    prefix="/estate",
    tags=["Estate"],
)

@router.post("/create-estate", response_model=EstateReadSchema)
async def create_estate(
        estate_data: EstateCreateSchema,
        db: AsyncSession=Depends(get_async_session),
        user=Depends(current_user)
):
    estate = Estate(**estate_data.model_dump(), user_id=user.id)
    db.add(estate)
    await db.commit()
    await db.refresh(estate)
    return estate

