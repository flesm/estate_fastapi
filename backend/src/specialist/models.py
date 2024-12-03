from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Specialist(Base):
    __tablename__ = 'specialist'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    years_of_experience = Column(Integer, nullable=False)
    photo_url = Column(String)
    description = Column(Text)
    email = Column(String(255), nullable=True)
    phone_number = Column(String, nullable=True)
    social_media_url = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)

    user = relationship('User', back_populates='specialist')
    analyses = relationship('Analysis', back_populates='specialist', cascade='all, delete-orphan')
    reviews = relationship('SpecialistReview', back_populates='specialist', cascade='all, delete-orphan')