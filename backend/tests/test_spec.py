import pytest
from httpx import AsyncClient

from main import app


@pytest.mark.asyncio
async def test_get_approved_specialists(ac: AsyncClient):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/specialist/approved-specialists")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "John Doe"
    assert data[0]["is_approved"] is True
