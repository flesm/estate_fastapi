from estate.models import Estate
from report.models import Report

from datetime import datetime
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, Float
from sqlalchemy.orm import relationship

from database import Base

class Role(Base):
    __tablename__ = 'role'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    can_apply_for_specialist = Column(Boolean, default=False, nullable=False)
    can_view_profile = Column(Boolean, default=False, nullable=False)
    can_fill_evaluation_form = Column(Boolean, default=False, nullable=False)
    can_edit_user_data = Column(Boolean, default=False, nullable=False)

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

    estate = relationship('Estate', uselist=False, back_populates='user')
    role = relationship('Role', back_populates='users')
    specialist = relationship('Specialist', uselist=False, back_populates='user')


# class Estate(Base):
#     __tablename__ = "estate"
#
#     id = Column(Integer, primary_key=True, index=True)
#     area_total = Column(Float, nullable=False)  # агульная плошча нерухомасці
#     floor_number = Column(Integer, nullable=False)  # паверх, на якім знаходзіцца аб'ект
#     total_floors = Column(Integer, nullable=True)  # агульная колькасць паверхаў у будынку
#     building_type = Column(String, nullable=False)  # тып будынка (напрыклад, цэгла, панэль і г.д.)
#     year_built = Column(Integer, nullable=True)  # год пабудовы будынка
#     ceiling_height = Column(Float, nullable=True)  # вышыня столяў
#     has_balcony = Column(Boolean, nullable=True)  # наяўнасць балкона
#     condition = Column(String, nullable=True)  # стан аб'екта (напрыклад, патрабуе рамонту)
#     address = Column(String, nullable=False)  # адрас аб'екта нерухомасці
#     heating = Column(String, nullable=True)  # тып ацяплення (напрыклад, цэнтральнае)
#     water_supply = Column(Boolean, nullable=True)  # наяўнасць водазабеспячэння
#     sewerage = Column(Boolean, nullable=True)  # наяўнасць каналізацыі
#     electricity = Column(Boolean, nullable=True)  # наяўнасць электразабеспячэння
#     gas = Column(Boolean, nullable=True)  # наяўнасць газазабеспячэння
#     internet = Column(Boolean, nullable=True)  # наяўнасць інтэрнэту
#
#     user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
#
#     user = relationship("User", back_populates="estate")
#     report = relationship("Report", uselist=False, back_populates="estate")
#
#
# class Report(Base):
#     __tablename__ = "report"
#
#     id = Column(Integer, primary_key=True, index=True)
#     estimated_value = Column(Float, nullable=False)  # ацэначны кошт
#     price_per_sqm = Column(Float, nullable=False)  # кошт за кважратны метар
#     created_at = Column(TIMESTAMP, default=datetime.utcnow)
#
#     estate_id = Column(Integer, ForeignKey('estate.id'), nullable=False)
#
#     estate = relationship("Estate", back_populates="report")
