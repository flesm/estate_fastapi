import pytest
from httpx import AsyncClient
from faker import Faker
from main import app

fake = Faker()

@pytest.mark.asyncio
async def test_register_user(ac: AsyncClient):
    user_data = {
        "email": fake.email(),
        "password": "StrongPassword123",
        "is_active": True,
        "is_superuser": False,
        "is_verified": False,
        "role_id": 2,
    }

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/register/register", json=user_data)

    assert response.status_code == 201

    response_json = response.json()
    assert "password" not in response_json
