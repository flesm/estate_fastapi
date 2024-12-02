import httpx
from fastapi import HTTPException

YANDEX_API_KEY = "0f33d76e-0644-470e-942b-ea01b075ee46"

async def reverse_geocode(lat: float, lon: float) -> str:
    """Получение адреса по координатам."""
    base_url = "https://geocode-maps.yandex.ru/1.x/"
    params = {
        "apikey": YANDEX_API_KEY,
        "geocode": f"{lon},{lat}",  # Яндекс ожидает "долгота,широта"
        "format": "json",
        "kind": "house"  # Ограничиваем поиск до домов (опционально)
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(base_url, params=params)
        if response.status_code == 200:
            geo_data = response.json()
            try:
                address = (
                    geo_data["response"]["GeoObjectCollection"]["featureMember"][0]
                    ["GeoObject"]["metaDataProperty"]["GeocoderMetaData"]["text"]
                )
                return address
            except (IndexError, KeyError):
                raise HTTPException(status_code=404, detail="Address not found")
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch address")