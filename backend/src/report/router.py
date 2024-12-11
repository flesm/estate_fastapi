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
from report.services import call_spring_boot_estimation, ReportService
from report.shcemas import ReportReadSchema

router = APIRouter(
    prefix="/report",
    tags=["Report"],
)


# class EstateService:
#     def __init__(self, db: AsyncSession, user):
#         self.db = db
#         self.user = user
#
#     async def create_estate(self, estate_data: EstateCreateSchema) -> Estate:
#         estate = Estate(**estate_data.model_dump(), user_id=self.user.id)
#         self.db.add(estate)
#         await self.db.commit()
#         await self.db.refresh(estate)
#         return estate

# class ReportService:
#     def __init__(self, db: AsyncSession):
#         self.db = db
#
#     async def create_report(self, estate: Estate, estimated_value: float, price_per_sqm: float) -> Report:
#         report = Report(
#             estimated_value=estimated_value,
#             price_per_sqm=price_per_sqm,
#             estate_id=estate.id,
#             created_at=datetime.utcnow()
#         )
#         self.db.add(report)
#         await self.db.commit()
#         await self.db.refresh(report)
#         return report

@router.post("/create-report", response_model=ReportReadSchema)
async def create_report(
    estate_data: EstateCreateSchema,
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_user)
):
    estate_service = EstateService(db, user)
    report_service = ReportService(db)

    estate = await estate_service.create_estate(estate_data)

    spring_boot_response = await call_spring_boot_estimation(estate_data.model_dump())
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