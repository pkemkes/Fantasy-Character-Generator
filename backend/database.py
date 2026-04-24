import aiosqlite
import os
from config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    race TEXT NOT NULL,
    class_ TEXT NOT NULL,
    background TEXT NOT NULL,
    appearance TEXT NOT NULL DEFAULT '',
    profession TEXT NOT NULL DEFAULT '',
    personality_trait TEXT NOT NULL DEFAULT '',
    quirk TEXT NOT NULL DEFAULT '',
    catchphrase TEXT NOT NULL DEFAULT '',
    image_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS image_generation_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL REFERENCES characters(id),
    generated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


async def get_db() -> aiosqlite.Connection:
    os.makedirs(os.path.dirname(settings.database_path), exist_ok=True)
    db = await aiosqlite.connect(settings.database_path)
    db.row_factory = aiosqlite.Row
    return db


async def init_db():
    db = await get_db()
    try:
        await db.executescript(SCHEMA)
        await db.commit()
    finally:
        await db.close()
