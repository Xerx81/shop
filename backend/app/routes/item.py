from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemRead


router = APIRouter()


@router.get("/", response_model=list[ItemRead])
def read_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


@router.get("/{item_id}", response_model=ItemRead)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemRead)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    item = Item(name=item.name, description=item.description, price=item.price)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ItemRead)
async def update_item(item_id: int, item_update: ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first() 
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    db_item.name = item_update.name
    db_item.description = item_update.description
    db_item.price = item_update.price

    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}", status_code=204)
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(db_item)
    db.commit()
    return
