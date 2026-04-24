import uuid
from database import get_db


async def create_character(data: dict) -> dict:
    character_id = str(uuid.uuid4())
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO characters (id, name, race, class_, background, appearance,
               profession, personality_trait, quirk, catchphrase)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                character_id,
                data["name"],
                data["race"],
                data["class_"],
                data["background"],
                data.get("appearance", ""),
                data.get("profession", ""),
                data.get("personality_trait", ""),
                data.get("quirk", ""),
                data.get("catchphrase", ""),
            ),
        )
        await db.commit()
        return await get_character(character_id)
    finally:
        await db.close()


async def get_character(character_id: str) -> dict | None:
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM characters WHERE id = ?", (character_id,)
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return dict(row)
    finally:
        await db.close()


async def update_character_image(character_id: str, image_path: str):
    db = await get_db()
    try:
        await db.execute(
            "UPDATE characters SET image_path = ? WHERE id = ?",
            (image_path, character_id),
        )
        await db.commit()
    finally:
        await db.close()
