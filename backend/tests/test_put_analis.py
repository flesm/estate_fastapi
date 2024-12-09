import pytest
from httpx import AsyncClient

from main import app

async def get_auth_token(ac: AsyncClient):
    login_data = {
        "username": "user@example.com",
        "password": "StrongPassword123",
    }
    response = await ac.post("/auth/login", data=login_data)
    assert response.status_code == 200, f"Auth failed: {response.status_code}, {response.text}"
    data = response.json()
    assert "access_token" in data, "No access token in response"
    return data["access_token"]


@pytest.mark.asyncio
async def test_put_analysis(ac: AsyncClient):
    async with AsyncClient(app=app, base_url="http://test") as ac:

        token = await get_auth_token(ac)
        headers = {
            "Authorization": f"Bearer {token}",
        }

        analysis_data = {
            "description": "The most popular analysist in the world/",
        }

        response = await ac.put("/analysis/2", json=analysis_data, headers=headers)

        assert response.status_code == 200, f"PUT failed: {response.text}"
        data = response.json()
        assert data["description"] == analysis_data["description"]
        assert data["spec_id"] == 2