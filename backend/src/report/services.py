from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

import httpx
from fastapi import HTTPException

from estate.models import Estate
from report.models import Report

class SpringCaller:
    def __init__(self):
        self.url = "http://localhost:8080/api/estates"

    async def call_spring_boot_estimation(self, estate_data: dict):
        async with httpx.AsyncClient() as client:
            response = await client.post(self.url, json=estate_data)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error from Spring Boot: {response.json().get('error', 'Unknown error')}"
                )
            return response.json()

class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_report(self, estate: Estate, estimated_value: float, price_per_sqm: float) -> Report:
        report = Report(
            estimated_value=estimated_value,
            price_per_sqm=price_per_sqm,
            estate_id=estate.id,
            created_at=datetime.utcnow()
        )
        self.db.add(report)
        await self.db.commit()
        await self.db.refresh(report)
        return report