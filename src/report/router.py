from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth.base_config import current_user
from database import get_async_session
from estate.models import Estate
from report.models import Report
from report.shcemas import ReportReadSchema
from valuation_algorithm import calculate_estimate

router = APIRouter(
    prefix="/report",
    tags=["Report"],
)

## паправіць, не працуе

# @router.post("/{estate_id}/create-report", response_model=ReportReadSchema)
# async def create_report(
#         estate_id: int,
#         db: AsyncSession=Depends(get_async_session),
#         user=Depends(current_user)
# ):
#
#     result = await db.execute(
#         select(Estate).filter(Estate.id == estate_id, Estate.user_id == user.id)
#     )
#     estate = result.scalars().first()
#
#     if not estate:
#         raise HTTPException(status_code=404, detail="Estate not found")
#
#     estimated_value, price_per_sqm = calculate_estimate(estate)
#
#     report = Report(
#         estimated_value=estimated_value,
#         price_per_sqm=price_per_sqm,
#         estate_id=estate.id,
#         created_at=datetime.utcnow()
#     )
#     db.add(report)
#     await db.commit()
#     await db.refresh(report)
#     return report
#
#
# @router.get("/user-reports", response_model=List[ReportReadSchema])
# async def get_user_reports(
#     db: AsyncSession=Depends(get_async_session),
#     user: int = Depends(current_user)
# ):
#     results = await db.execute(
#         select(Report).join(Report.estate).filter(Estate.user_id == user.id)
#     )
#     reports = results.scalars().all()
#     if not reports:
#         raise HTTPException(status_code=404, detail="No reports found for this user")
#     return reports