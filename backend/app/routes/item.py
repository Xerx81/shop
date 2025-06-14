from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemRead
from app.utils.auth import login_required


router = APIRouter()


@router.get("/", response_model=list[ItemRead], dependencies=[Depends(login_required)])
def read_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


@router.get("/{item_id}", response_model=ItemRead, dependencies=[Depends(login_required)])
def read_item(item_id: int, db: Session = Depends(get_db)):
    # Check if item exists
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemRead, dependencies=[Depends(login_required)])
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    # Add item
    item = Item(name=item.name, description=item.description, price=item.price)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ItemRead, dependencies=[Depends(login_required)])
async def update_item(item_id: int, item_update: ItemCreate, db: Session = Depends(get_db)):
    # Check if item exists
    db_item = db.query(Item).filter(Item.id == item_id).first() 
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Update item
    db_item.name = item_update.name
    db_item.description = item_update.description
    db_item.price = item_update.price

    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}", status_code=204, dependencies=[Depends(login_required)])
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    # Check if item exists
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Delete item
    db.delete(db_item)
    db.commit()
    return
