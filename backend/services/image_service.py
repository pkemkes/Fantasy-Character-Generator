import os
import base64
from datetime import datetime, timezone
from openai import AsyncOpenAI
from config import settings
from database import get_db


client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


def _build_prompt(character: dict) -> str:
    return (
        f"Fantasy portrait of a {character['race']} {character['class_']}, "
        f"{character['appearance']}. "
        f"They are a {character['profession']} with a {character['background']} background. "
        f"Personality: {character['personality_trait']}. "
        f"Quirk: {character['quirk']}. "
        f"Detailed fantasy art style, vibrant colors."
    )


async def get_daily_count() -> int:
    db = await get_db()
    try:
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        cursor = await db.execute(
            "SELECT COUNT(*) as cnt FROM image_generation_log WHERE date(generated_at) = ?",
            (today,),
        )
        row = await cursor.fetchone()
        return row["cnt"] if row else 0
    finally:
        await db.close()


async def log_generation(character_id: str):
    db = await get_db()
    try:
        await db.execute(
            "INSERT INTO image_generation_log (character_id) VALUES (?)",
            (character_id,),
        )
        await db.commit()
    finally:
        await db.close()


async def generate_image(character: dict) -> str:
    if not client:
        raise RuntimeError("OPENAI_API_KEY is not configured")

    count = await get_daily_count()
    if count >= settings.daily_image_limit:
        raise ValueError("Daily image generation limit reached")

    os.makedirs(settings.image_dir, exist_ok=True)
    prompt = _build_prompt(character)

    result = await client.images.generate(
        model=settings.image_model,
        prompt=prompt,
        n=1,
        size="1024x1024",
    )

    image_data = base64.b64decode(result.data[0].b64_json)
    filename = f"{character['id']}.png"
    filepath = os.path.join(settings.image_dir, filename)
    with open(filepath, "wb") as f:
        f.write(image_data)

    await log_generation(character["id"])

    return filename
