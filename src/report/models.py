from sqlalchemy import Column, Float, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Report(Base):
    __tablename__ = 'report'

    id = Column(Integer, primary_key=True, index=True)
    estimated_value = Column(Float, nullable=False)  # ацэначны кошт
    price_per_sqm = Column(Float, nullable=False)  # кошт за кважратны метар
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    estate_id = Column(Integer, ForeignKey('estate.id'), nullable=False)
    estate = relationship('Estate', back_populates='report')