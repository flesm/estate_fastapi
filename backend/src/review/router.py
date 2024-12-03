from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from analysis.models import Analysis
from review.models import SpecialistReview, AnalysisReview
from database import get_async_session
from auth.base_config import current_user
from review.schemas import SpecialistReviewCreate, SpecialistReviewOut, AnalysisReviewCreate, AnalysisReviewOut

from specialist.models import Specialist

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)

# View all reviews for a specific specialist
@router.get("/specialist/{spec_id}", response_model=List[SpecialistReviewOut])
async def get_specialist_reviews(
        spec_id: int,
        db: AsyncSession = Depends(get_async_session)
):
    reviews = await db.execute(select(SpecialistReview).where(SpecialistReview.spec_id == spec_id))
    return reviews.scalars().all()

# View all reviews for a specific analysis
@router.get("/analysis/{analysis_id}", response_model=List[AnalysisReviewOut])
async def get_analysis_reviews(
        analysis_id: int,
        db: AsyncSession = Depends(get_async_session)
):
    reviews = await db.execute(select(AnalysisReview).where(AnalysisReview.analysis_id == analysis_id))
    return reviews.scalars().all()


# Create a review for a specific specialist
@router.post("/specialist/{spec_id}", response_model=SpecialistReviewOut)
async def create_specialist_review(
    spec_id: int,
    review_data: SpecialistReviewCreate,
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_user),
):
    # Validate the existence of the specialist
    specialist = await db.get(Specialist, spec_id)
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found.")

    # Create and save the new review
    new_review = SpecialistReview(
        **review_data.dict(exclude={"spec_id"}),  # Exclude spec_id from the payload
        specialist_id=spec_id,                   # Use route parameter
        user_id=user.id
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    return new_review

# Create a review for a specific analysis
@router.post("/analysis/{analysis_id}", response_model=AnalysisReviewOut)
async def create_analysis_review(
    analysis_id: int,
    review_data: AnalysisReviewCreate,
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_user),
):
    # Validate the existence of the analysis
    analysis = await db.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    # Create and save the new review
    new_review = AnalysisReview(
        **review_data.dict(exclude={"analysis_id"}),  # Exclude analysis_id from the payload
        analysis_id=analysis_id,                      # Use route parameter
        user_id=user.id
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    return new_review

# Update a user's review for a specific specialist
@router.put("/specialist/{review_id}", response_model=SpecialistReviewOut)
async def update_specialist_review(
        review_id: int,
        review_data: SpecialistReviewCreate,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    review = await db.get(SpecialistReview, review_id)
    if not review or review.user_id != user.id:
        raise HTTPException(status_code=404, detail="Review not found or not authorized to update.")

    for key, value in review_data.dict().items():
        setattr(review, key, value)
    await db.commit()
    await db.refresh(review)
    return review

# Update a user's review for a specific analysis
@router.put("/analysis/{review_id}", response_model=AnalysisReviewOut)
async def update_analysis_review(
        review_id: int,
        review_data: AnalysisReviewCreate,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    review = await db.get(AnalysisReview, review_id)
    if not review or review.user_id != user.id:
        raise HTTPException(status_code=404, detail="Review not found or not authorized to update.")

    for key, value in review_data.dict().items():
        setattr(review, key, value)
    await db.commit()
    await db.refresh(review)
    return review

# Delete a user's review for a specific specialist
@router.delete("/specialist/{review_id}", response_model=SpecialistReviewOut)
async def delete_specialist_review(
        review_id: int,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    review = await db.get(SpecialistReview, review_id)
    if not review or review.user_id != user.id:
        raise HTTPException(status_code=404, detail="Review not found or not authorized to delete.")

    await db.delete(review)
    await db.commit()
    return review

# Delete a user's review for a specific analysis
@router.delete("/analysis/{review_id}", response_model=AnalysisReviewOut)
async def delete_analysis_review(
        review_id: int,
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    review = await db.get(AnalysisReview, review_id)
    if not review or review.user_id != user.id:
        raise HTTPException(status_code=404, detail="Review not found or not authorized to delete.")

    await db.delete(review)
    await db.commit()
    return review
