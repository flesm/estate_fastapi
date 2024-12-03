from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import select
from analysis.models import Analysis
from sqlalchemy.ext.asyncio import AsyncSession

from auth.base_config import current_user
from database import get_async_session

from typing import List
from analysis.schemas import AnalysisCreate, AnalysisUpdate, AnalysisOut, AnalysisOut4Users
from specialist.models import Specialist

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get("/all-analysis", response_model=List[AnalysisOut4Users])
async def get_all_analysis_with_specialist(db: AsyncSession = Depends(get_async_session)):
    query = select(Analysis, Specialist.name).join(Specialist, Specialist.id == Analysis.spec_id)
    result = await db.execute(query)
    analyses = result.fetchall()
    return [{"id": analysis.id, "time_created": analysis.time_created, "spec_id": analysis.spec_id, "description": analysis.description, "specialist_name": specialist_name} for analysis, specialist_name in analyses]



@router.get("/my-analysis", response_model=List[AnalysisOut])
async def get_analyses(
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    query = (
        select(Analysis)
        .join(Specialist, Specialist.id == Analysis.spec_id)
        .where(Specialist.user_id == user.id)
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/new-analysis", response_model=AnalysisOut)
async def create_analysis(
        analysis_data: AnalysisCreate,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    # Находим специалиста, связанного с пользователем
    specialist = await db.execute(
        select(Specialist).where(Specialist.user_id == user.id)
    )
    specialist = specialist.scalar_one_or_none()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found for the current user.")

    # Создаем новый анализ
    new_analysis = Analysis(
        **analysis_data.model_dump(),
        spec_id=specialist.id
    )
    db.add(new_analysis)
    await db.commit()
    await db.refresh(new_analysis)
    return new_analysis


@router.put("/{analysis_id}", response_model=AnalysisOut)
async def update_analysis(
        analysis_id: int,
        analysis_data: AnalysisUpdate,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    # Проверяем связь анализа с текущим пользователем через специалиста
    query = (
        select(Analysis)
        .join(Specialist, Specialist.id == Analysis.spec_id)
        .where(Specialist.user_id == user.id, Analysis.id == analysis_id)
    )
    existing_analysis = await db.execute(query)
    existing_analysis = existing_analysis.scalar_one_or_none()
    if not existing_analysis:
        raise HTTPException(status_code=404, detail="Analysis not found or no permission to update.")

    # Обновляем данные
    for key, value in analysis_data.model_dump(exclude_unset=True).items():
        setattr(existing_analysis, key, value)
    await db.commit()
    await db.refresh(existing_analysis)
    return existing_analysis


@router.delete("/{analysis_id}", response_model=AnalysisOut)
async def delete_analysis(
        analysis_id: int,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    # Проверяем связь анализа с текущим пользователем через специалиста
    query = (
        select(Analysis)
        .join(Specialist, Specialist.id == Analysis.spec_id)
        .where(Specialist.user_id == user.id, Analysis.id == analysis_id)
    )
    analysis_to_delete = await db.execute(query)
    analysis_to_delete = analysis_to_delete.scalar_one_or_none()
    if not analysis_to_delete:
        raise HTTPException(status_code=404, detail="Analysis not found or no permission to delete.")

    # Удаляем анализ
    await db.delete(analysis_to_delete)
    await db.commit()
    return analysis_to_delete
