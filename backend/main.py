from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine
from app.models import auth, item
from app.routes import auth as auth_routes, item as item_routes


item.Base.metadata.create_all(bind=engine)
auth.Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(item_routes.router, prefix="/api")
app.include_router(auth_routes.router, prefix="/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
