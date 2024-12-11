from estate.models import Estate
from estate.schemas import EstateCreateSchema
from sqlalchemy.ext.asyncio import AsyncSession


class EstateService:
    def __init__(self, db: AsyncSession, user):
        self.db = db
        self.user = user

    async def create_estate(self, estate_data: EstateCreateSchema) -> Estate:
        estate = Estate(**estate_data.model_dump(), user_id=self.user.id)
        self.db.add(estate)
        await self.db.commit()
        await self.db.refresh(estate)
        return estate