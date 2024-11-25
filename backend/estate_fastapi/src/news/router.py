from fastapi import APIRouter
from news.services import parse_news

router = APIRouter(
    prefix="/news",
    tags=["News"],
)

@router.get("/")
async def get_news():
    news = await parse_news()
    return {"news": news}