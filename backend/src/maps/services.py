import httpx
from fastapi import HTTPException

class YandexGeocoder:
    def __init__(self):
        self.api_key = "0f33d76e-0644-470e-942b-ea01b075ee46"
        self.base_url = "https://geocode-maps.yandex.ru/1.x/"

    async def reverse_geocode(self, lat: float, lon: float) -> str:
        base_url = self.base_url
        params = {
            "apikey": self.api_key,
            "geocode": f"{lon},{lat}",
            "format": "json",
            "kind": "house"
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