from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine, SessionLocal
from .routers import auth, users, market, trading, learning, economy
from .seed import seed_if_needed


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_if_needed(db)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(market.router)
app.include_router(trading.router)
app.include_router(learning.router)
app.include_router(economy.router)


@app.get("/health")
def health():
    return {"ok": True}
