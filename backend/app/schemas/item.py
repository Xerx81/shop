from pydantic import BaseModel


class ItemBase(BaseModel):
    name: str
    description: str | None = None
    price: float


class ItemCreate(ItemBase):
    pass


class ItemRead(ItemBase):
    id: int

    class Config:
        orm_mode = True
