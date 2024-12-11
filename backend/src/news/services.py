import httpx
from bs4 import BeautifulSoup


class NewsParser:

    def __init__(self):
        self.url = "https://realt.by/news/"

    async def fetch_news(self):
        async with httpx.AsyncClient() as client:
            response = await client.get(self.url)
            response.raise_for_status()
            return response.text

    async def parse_news(self):
        html_content = await self.fetch_news()
        soup = BeautifulSoup(html_content, 'html.parser')
        all_news = soup.findAll('div', class_='bd-item')

        news_data = []

        for news in all_news:
            image_tag = news.find('img')
            image_url = image_tag['src'] if image_tag else None

            views_tag = news.find('span', class_='views')
            views = views_tag.get_text(strip=True) if views_tag else None

            title_tag = news.find('div', class_='title').find('a', class_='b12')
            title = title_tag.get_text(strip=True) if title_tag else None

            date_tag = news.find('span', class_='data')
            date = date_tag.get_text(strip=True) if date_tag else None

            content_tag = news.find('div', class_='bd-item-right-center-2')
            content = content_tag.get_text(strip=True) if content_tag else None

            news_data.append({
                'image_url': image_url,
                'views': views,
                'title': title,
                'date': date,
                'content': content,
            })

        return news_data