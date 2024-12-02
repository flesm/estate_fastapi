from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from auth.base_config import current_user
from database import get_async_session
from estate.models import Estate
from estate.schemas import EstateCreateSchema, EstateReadSchema
from report.models import Report
from valuation_algorithm import calculate_estimate

router = APIRouter(
    prefix="/estate",
    tags=["Estate"],
)

@router.post("/create-estate", response_model=EstateReadSchema)
async def create_estate(
        estate_data: EstateCreateSchema,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    # Создание объекта недвижимости
    estate = Estate(**estate_data.model_dump(), user_id=user.id)
    db.add(estate)
    await db.commit()
    await db.refresh(estate)

    # Расчет стоимости и создание отчета
    estimated_value, price_per_sqm = calculate_estimate(estate)
    report = Report(
        estimated_value=estimated_value,
        price_per_sqm=price_per_sqm,
        estate_id=estate.id,
        created_at=datetime.utcnow()
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    # Возврат созданного объекта с отчетом
    return {
        "estate": estate,
        "report": report
    }

