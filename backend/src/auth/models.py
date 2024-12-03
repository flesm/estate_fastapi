from datetime import datetime
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP
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
    specialist_reviews = relationship('SpecialistReview', back_populates='user')
    analysis_reviews = relationship('AnalysisReview', back_populates='user')
