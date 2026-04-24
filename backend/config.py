from pathlib import Path

from pydantic_settings import BaseSettings

_BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    openai_api_key: str = ""
    image_model: str = "gpt-image-2"
    database_path: str = "./data/characters.db"
    image_dir: str = "./data/generated_images"
    daily_image_limit: int = 30
    base_url: str = "http://localhost:8000"

    # LangSmith tracing
    langchain_api_key: str = ""
    langchain_tracing_v2: str = "false"
    langchain_project: str = "fantasy-character-generator"
    langchain_endpoint: str = "https://api.smith.langchain.com"

    model_config = {
        "env_file": str(_BASE_DIR / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
