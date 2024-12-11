from fastapi import APIRouter, HTTPException, Query
from maps.services import YandexGeocoder

router = APIRouter(
    prefix="/maps",
    tags=["Maps"],
)

yandex_geocoder = YandexGeocoder()

@router.get("/get_address")
async def get_address(lat: float = Query(...), lon: float = Query(...)):
    try:
        address = await yandex_geocoder.reverse_geocode(lat, lon)
        return {"address": address}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))