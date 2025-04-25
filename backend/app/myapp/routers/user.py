from fastapi import APIRouter
from .. import database, schemas, models
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, status
from ..repository import user
from typing import List

router = APIRouter(
    prefix="/api/user",
    tags=['Users']
)

get_db = database.get_db


@router.post('/create', response_model=schemas.ShowUser)
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    return user.create(request, db)

@router.get('/all', response_model=List[schemas.ShowallUser])
def get_user(db: Session = Depends(get_db)):
    return user.show_all_user(db)

@router.get('/{id}', response_model=schemas.ShowUser)
def get_user(db: Session = Depends(get_db)):
    return user.show(db)