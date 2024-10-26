from fastapi import APIRouter

from auth.base_config import fastapi_users, auth_backend
from auth.schemas import UserRead, UserCreate, UserUpdate

router = APIRouter()

# router for login and logout
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["Auth"]
)

# router for registration
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/register",
    tags=["Register"]
)

# router for partitional update (patch), delete, get (4 admin) and get, update (4 user)
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/user",
    tags=["User"]
)