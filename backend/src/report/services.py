import httpx
from fastapi import HTTPException


async def call_spring_boot_estimation(estate_data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:8080/api/estates", json=estate_data)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from Spring Boot: {response.json().get('error', 'Unknown error')}"
            )
        return response.json()