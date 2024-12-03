from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Analysis(Base):
    __tablename__ = 'analysis'

    id = Column(Integer, primary_key=True)
    time_created = Column(DateTime, default=datetime.utcnow, nullable=False)
    description = Column(Text, nullable=False)
    spec_id = Column(Integer, ForeignKey('specialist.id'), nullable=False)

    specialist = relationship('Specialist', back_populates='analyses')
    reviews = relationship('AnalysisReview', back_populates='analysis', cascade='all, delete-orphan')