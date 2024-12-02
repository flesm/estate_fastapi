import asyncio

import httpx

async def send_estate_data():
    estate_data = {
        "area_total": 85.0,
        "floor_number": 3,
        "total_floors": 5,
        "building_type": "brick",
        "year_built": 2005,
        "ceiling_height": 2.8,
        "has_balcony": True,
        "condition": "good",
        "address": "Minsk, Some Street",
        "heating": "central",
        "water_supply": True,
        "sewerage": True,
        "electricity": True,
        "gas": True,
        "internet": True,
        "user_id": 1
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:8080/api/estates", json=estate_data)
        print(response.json())

# C:\Users\young>curl -X POST http://localhost:8080/api/estates -H "Content-Type: application/json" -d "{\"area_total\": 100}"
# {"area_total":100,"generatedReport":{"created_at":1733121300631,"estimated_value":120000.0,"price_per_sqm":1200.0}}


asyncio.run(send_estate_data())
