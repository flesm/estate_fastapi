from datetime import datetime

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, TIMESTAMP, Text
from sqlalchemy.orm import relationship

from database import Base

class Role(Base):
    __tablename__ = 'role'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    permissions = Column(JSON, nullable=False)

    users = relationship('User', back_populates='role')


class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    registered_at = Column(TIMESTAMP, default=datetime.utcnow)
    hashed_password = Column(String(length=1024), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    role_id = Column(Integer, ForeignKey('role.id'), nullable=False)

    role = relationship('Role', back_populates='users')
    specialist_info = relationship('Specialist', uselist=False, back_populates='user')


# class Specialist(Base):
#     __tablename__ = 'specialist'
#
#     id = Column(Integer, primary_key=True)
#     name = Column(String, nullable=False)
#     years_of_experience = Column(Integer, nullable=False)
#     photo_url = Column(String)
#     description = Column(Text)
#     email = Column(String(255), nullable=True)
#     phone_number = Column(String, nullable=True)
#     social_media_url = Column(String, nullable=True)
#     user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
#
#     user = relationship('User', back_populates='specialist_info')