from fastapi import APIRouter, HTTPException, Query
from maps.services import reverse_geocode

router = APIRouter(
    prefix="/maps",
    tags=["Maps"],
)

@router.get("/get_address")
async def get_address(lat: float = Query(...), lon: float = Query(...)):
    """Маршрут для получения адреса по координатам."""
    try:
        address = await reverse_geocode(lat, lon)
        return {"address": address}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))