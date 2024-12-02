from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Estate(Base):
    __tablename__ = 'estate'

    id = Column(Integer, primary_key=True, index=True)
    area_total = Column(Float, nullable=False)  # агульная плошча нерухомасці
    floor_number = Column(Integer, nullable=False)  # паверх, на якім знаходзіцца аб'ект
    total_floors = Column(Integer, nullable=True)  # агульная колькасць паверхаў у будынку
    building_type = Column(String, nullable=False)  # тып будынка (напрыклад, цэгла, панэль і г.д.)
    year_built = Column(Integer, nullable=True)  # год пабудовы будынка
    ceiling_height = Column(Float, nullable=True)  # вышыня столяў
    has_balcony = Column(Boolean, nullable=True)  # наяўнасць балкона
    condition = Column(String, nullable=True)  # стан аб'екта (напрыклад, патрабуе рамонту)
    address = Column(String, nullable=False)  # адрас аб'екта нерухомасці
    heating = Column(String, nullable=True)  # тып ацяплення (напрыклад, цэнтральнае)
    water_supply = Column(Boolean, nullable=True)  # наяўнасць водазабеспячэння
    sewerage = Column(Boolean, nullable=True)  # наяўнасць каналізацыі
    electricity = Column(Boolean, nullable=True)  # наяўнасць электразабеспячэння
    gas = Column(Boolean, nullable=True)  # наяўнасць газазабеспячэння
    internet = Column(Boolean, nullable=True)  # наяўнасць інтэрнэту

    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    user = relationship('User', back_populates='estate')
    report = relationship('Report', back_populates='estate')

    def to_dict(self):
        return {column.name: getattr(self, column.name) for column in self.__table__.columns}