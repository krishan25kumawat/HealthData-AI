from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import query, schema
from app.db.database import close_mongo_connection, connect_to_mongo

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    yield
    close_mongo_connection()

app = FastAPI(
    title="Healthcare Data Query API",
    description="API for chatbot-based healthcare data querying.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router, prefix="/api/v1")
app.include_router(schema.router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "System is operational"}
