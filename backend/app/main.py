from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.resume import router as resume_router
import os

app = FastAPI(title="AI Resume Customizer")

# Add CORS for frontend, configurable via env
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Resume Customizer API"}

@app.get("/health")
async def health():
    return {"status": "ok"}