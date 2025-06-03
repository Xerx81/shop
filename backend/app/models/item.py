from sqlalchemy import Column, Float, Integer, String
from app.database.db import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False, default=0.0)

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}(id={self.id}, name={self.name}, price={self.price})>"
