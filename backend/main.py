import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from config import settings
from database import init_db
from models import OptionsResponse, StatsResponse
from options import RACES, CLASSES, BACKGROUNDS, PROFESSIONS, PERSONALITY_TRAITS, QUIRKS
from routers import characters, images
from services.image_service import get_daily_count


def _configure_langsmith():
    if settings.langchain_api_key:
        os.environ.setdefault("LANGCHAIN_API_KEY", settings.langchain_api_key)
        os.environ.setdefault("LANGCHAIN_TRACING_V2", settings.langchain_tracing_v2)
        os.environ.setdefault("LANGCHAIN_PROJECT", settings.langchain_project)
        os.environ.setdefault("LANGCHAIN_ENDPOINT", settings.langchain_endpoint)


@asynccontextmanager
async def lifespan(app: FastAPI):
    _configure_langsmith()
    await init_db()
    os.makedirs(settings.image_dir, exist_ok=True)
    yield


app = FastAPI(title="Fantasy Character Generator", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(characters.router)
app.include_router(images.router)

# Serve generated images
app.mount(
    "/api/images",
    StaticFiles(directory=settings.image_dir, check_dir=False),
    name="generated_images",
)


@app.get("/api/options", response_model=OptionsResponse)
async def get_options():
    return OptionsResponse(
        races=RACES,
        classes=CLASSES,
        backgrounds=BACKGROUNDS,
        professions=PROFESSIONS,
        personality_traits=PERSONALITY_TRAITS,
        quirks=QUIRKS,
    )


@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    count = await get_daily_count()
    return StatsResponse(
        images_generated_today=count,
        daily_limit=settings.daily_image_limit,
        remaining=max(0, settings.daily_image_limit - count),
    )


# Serve React SPA - check if static dir exists
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="static_assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
