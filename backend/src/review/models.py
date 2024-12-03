from datetime import datetime

from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship

from database import Base


class SpecialistReview(Base):
    __tablename__ = 'specialist_review'

    id = Column(Integer, primary_key=True)
    time_created = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(Text, nullable=False)
    spec_id = Column(Integer, ForeignKey('specialist.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)  # Добавлен внешний ключ на пользователя

    specialist = relationship('Specialist', back_populates='reviews')
    user = relationship('User', back_populates='specialist_reviews')  # Связь с пользователем

class AnalysisReview(Base):
    __tablename__ = 'analysis_review'

    id = Column(Integer, primary_key=True)
    time_created = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(Text, nullable=False)
    analysis_id = Column(Integer, ForeignKey('analysis.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)  # Добавлен внешний ключ на пользователя

    analysis = relationship('Analysis', back_populates='reviews')
    user = relationship('User', back_populates='analysis_reviews')  # Связь с пользователем
