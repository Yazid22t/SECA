from fastapi import FastAPI
from db.database import engine, Base
from db import auth


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
