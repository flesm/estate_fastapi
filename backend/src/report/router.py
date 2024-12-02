from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from auth.base_config import current_user
from database import get_async_session
from estate.models import Estate
from estate.schemas import EstateReadSchema, EstateCreateSchema
from report.models import Report
from report.shcemas import ReportReadSchema
from valuation_algorithm import calculate_estimate

router = APIRouter(
    prefix="/report",
    tags=["Report"],
)


@router.post("/create-report", response_model=ReportReadSchema)
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

    # Преобразование объекта estate в словарь для Pydantic-схемы
    estate_dict = estate.to_dict()  # или использовать .dict() для более старых версий Pydantic

    # Возврат данных через схемы
    return ReportReadSchema(
        id=report.id,
        estimated_value=report.estimated_value,
        price_per_sqm=report.price_per_sqm,
        created_at=report.created_at,
        estate=EstateReadSchema.model_validate(estate_dict)  # Передаем словарь
    )



@router.get("/user-reports", response_model=List[ReportReadSchema])
async def get_user_reports(
    db: AsyncSession=Depends(get_async_session),
    user: int = Depends(current_user)
):
    results = await db.execute(
        select(Report)
        .options(selectinload(Report.estate))
        .join(Report.estate)
        .filter(Estate.user_id == user.id)
    )
    reports = results.scalars().all()
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found for this user")
    return reports