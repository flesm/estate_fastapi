from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List

from sqlalchemy.orm import joinedload

from admin.helpers import hash_password
from admin.schemas import RoleCheckResponse, SpecialistInfo, UserResponse, SpecialistBase, UserUpdate, UserResponseSpec, \
    AdminCreate, AdminResponse
from auth.models import Role, User
from admin.schemas import SpecialistCreate
from estate.models import Estate
from report.models import Report
from specialist.models import Specialist
from database import get_async_session
from auth.base_config import current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/specialist-requests", response_model=List[SpecialistCreate])
async def list_specialist_requests(
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)
):
    role = await db.get(Role, user.role_id)
    if not role or not role.can_edit_user_data:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(select(Specialist).where(Specialist.is_approved == False))
    specialists = result.scalars().all()
    return specialists



@router.post("/approve-specialist/{lead_id}")
async def approve_specialist(lead_id: int, db: AsyncSession = Depends(get_async_session)):
    # Получаем заявку специалиста из базы данных
    stmt = select(Specialist).where(Specialist.id == lead_id).options(joinedload(Specialist.user))
    result = await db.execute(stmt)
    specialist = result.scalar_one_or_none()

    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    # Обновляем поля Specialist и User
    specialist.is_approved = True
    if specialist.user:  # Проверяем, связан ли специалист с пользователем
        specialist.user.role_id = 3
    else:
        raise HTTPException(status_code=400, detail="Specialist is not linked to a user")

    try:
        await db.commit()
        return {"message": "Specialist approved successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to approve specialist: {str(e)}")


@router.post("/reject-specialist/{lead_id}")
async def reject_specialist(lead_id: int, db: AsyncSession = Depends(get_async_session)):
    # Получаем заявку специалиста из базы данных
    stmt = select(Specialist).where(Specialist.id == lead_id)
    result = await db.execute(stmt)
    specialist = result.scalar_one_or_none()

    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")

    # Удаляем заявку
    try:
        await db.delete(specialist)
        await db.commit()
        return {"message": "Specialist rejected and deleted successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reject specialist: {str(e)}")


@router.get("/check-role", response_model=RoleCheckResponse)
async def check_role(
        db: AsyncSession = Depends(get_async_session),
        user=Depends(current_user)):
    role = await db.get(Role, user.role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return {"role_id": role.id}


@router.get("/all-users", response_model=List[UserResponse])
async def get_users_with_roles(
    db: AsyncSession = Depends(get_async_session),
):
    # Запрос для получения пользователей с role_id = 2 или 3
    result = await db.execute(
        select(User).where(User.role_id.in_([2, 3]))
    )
    users = result.scalars().all()

    # Добавляем информацию о специалистах для пользователей с role_id = 3
    user_responses = []
    for user in users:
        specialist_info = None
        if user.role_id == 3:
            # Получаем данные из таблицы Specialist
            specialist = await db.execute(
                select(Specialist).where(Specialist.user_id == user.id)
            )
            specialist = specialist.scalars().first()
            if specialist:
                specialist_info = SpecialistInfo(
                    name=specialist.name,
                    phone_number=specialist.phone_number,
                    social_media_url=specialist.social_media_url,
                )

        user_responses.append(
            UserResponse(
                id=user.id,
                email=user.email,
                role_id=user.role_id,
                specialist=specialist_info,
            )
        )

    return user_responses



@router.get("/user/{user_id}", response_model=UserResponseSpec)
async def get_user(user_id: int, db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(
        select(User).options(joinedload(User.specialist)).filter(User.id == user_id)
    )
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Если роль 2, возвращаем только данные из User
    if user.role_id == 2:
        return UserResponseSpec(id=user.id, email=user.email, role=user.role_id, specialist=None)

    # Если роль 3, добавляем данные из Specialist
    if user.role_id == 3 and user.specialist:
        return UserResponse(
            id=user.id,
            email=user.email,
            role=user.role_id,
            specialist=SpecialistBase(
                name=user.specialist.name,
                phone_number=user.specialist.phone_number,
                social_media_url=user.specialist.social_media_url,
            ),
        )
    return UserResponse(id=user.id, email=user.email, role=user.role_id, specialist=None)

@router.patch("/user/{user_id}")
async def update_user(user_id: int, user_update: UserUpdate, db: AsyncSession = Depends(get_async_session)):
    print("Hello")
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Обновляем данные в таблице User
    if user_update.email:
        user.email = user_update.email

    # Если роль 3, обновляем данные из Specialist
    if user.role_id == 3 and user_update.specialist:
        result = await db.execute(select(Specialist).filter(Specialist.user_id == user_id))
        specialist = result.scalar()
        if not specialist:
            specialist = Specialist(user_id=user_id)
            db.add(specialist)

        if user_update.specialist.name:
            specialist.name = user_update.specialist.name
        if user_update.specialist.phone_number:
            specialist.phone_number = user_update.specialist.phone_number
        if user_update.specialist.social_media_url:
            specialist.social_media_url = user_update.specialist.social_media_url

    await db.commit()
    return {"detail": "Пользователь обновлен"}

@router.delete("/user/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_async_session)):
    # Проверка существования пользователя
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Если роль пользователя равна 3, удаляем данные из Specialist
    if user.role_id == 3:
        result = await db.execute(select(Specialist).filter(Specialist.user_id == user_id))
        specialist = result.scalar()
        if specialist:
            await db.delete(specialist)

    # Удаляем записи из таблицы Estate, связанные с пользователем
    result = await db.execute(select(Estate).filter(Estate.user_id == user_id))
    estates = result.scalars().all()
    for estate in estates:
        # Удаляем записи из таблицы Report, где estate_id совпадает с удаляемым Estate.id
        await db.execute(
            delete(Report).filter(Report.estate_id == estate.id)
        )
        await db.delete(estate)

    # Удаляем саму запись пользователя из таблицы User
    await db.delete(user)
    await db.commit()
    return {"detail": "Пользователь и все связанные данные удалены"}


@router.post("/register-admin", response_model=AdminResponse)
async def register_admin(
    user_create: AdminCreate,
    db: AsyncSession = Depends(get_async_session)
):
    # Проверка существования пользователя с таким же email
    result = await db.execute(select(User).filter(User.email == user_create.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

    # Установка роли администратора
    role_id = user_create.role_id
    role = await db.execute(select(Role).filter(Role.id == role_id))
    role = role.scalar_one_or_none()
    if not role or role.name != "Администратор":
        raise HTTPException(status_code=404, detail="Роль администратора не найдена")

    # Создание нового пользователя
    hashed_password = hash_password(user_create.password)
    new_user = User(
        email=user_create.email,
        hashed_password=hashed_password,
        is_active=user_create.is_active,
        is_superuser=user_create.is_superuser,
        is_verified=user_create.is_verified,
        role_id=role.id
    )
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)  # Обновляем объект для получения ID и других данных
        return AdminResponse(
            id=new_user.id,
            email=new_user.email,
            role_id=new_user.role_id
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка регистрации администратора: {str(e)}")