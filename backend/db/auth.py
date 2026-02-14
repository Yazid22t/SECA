from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db import models, schemas


router = APIRouter()

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        email=user.email,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    return {"msg": "User created"}

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    u = db.query(models.User).filter(
        models.User.email == user.email,
        models.User.password == user.password
    ).first()

    if u:
        return {"msg": "Login success"}
    return {"msg": "Invalid credentials"}
