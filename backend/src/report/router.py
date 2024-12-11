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
from estate.services import EstateService
from report.models import Report
from report.services import ReportService, SpringCaller
from report.shcemas import ReportReadSchema

router = APIRouter(
    prefix="/report",
    tags=["Report"],
)

spring_caller = SpringCaller()

@router.post("/create-report", response_model=ReportReadSchema)
async def create_report(
    estate_data: EstateCreateSchema,
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_user)
):
    estate_service = EstateService(db, user)
    report_service = ReportService(db)

    estate = await estate_service.create_estate(estate_data)

    spring_boot_response = await spring_caller.call_spring_boot_estimation(estate_data.model_dump())
    estimated_value = spring_boot_response["generatedReport"]["estimated_value"]
    price_per_sqm = spring_boot_response["generatedReport"]["price_per_sqm"]

    report = await report_service.create_report(estate, estimated_value, price_per_sqm)

    estate_dict = estate.to_dict()

    return ReportReadSchema(
        id=report.id,
        estimated_value=report.estimated_value,
        price_per_sqm=report.price_per_sqm,
        created_at=report.created_at,
        estate=EstateReadSchema.model_validate(estate_dict)
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