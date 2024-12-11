from fastapi import APIRouter
from news.services import NewsParser

router = APIRouter(
    prefix="/news",
    tags=["News"],
)

news_parser = NewsParser()

@router.get("/")
async def get_news():
    news = await news_parser.parse_news()
    return {"news": news}