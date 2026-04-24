from fastapi import APIRouter, HTTPException
from models import CharacterCreate, CharacterResponse
from services.character_service import create_character, get_character
from config import settings

router = APIRouter(prefix="/api", tags=["characters"])


def _to_response(row: dict) -> dict:
    image_url = None
    if row.get("image_path"):
        image_url = f"/api/images/{row['image_path']}"
    return CharacterResponse(
        id=row["id"],
        name=row["name"],
        race=row["race"],
        class_=row["class_"],
        background=row["background"],
        appearance=row["appearance"],
        profession=row["profession"],
        personality_trait=row["personality_trait"],
        quirk=row["quirk"],
        catchphrase=row["catchphrase"],
        image_url=image_url,
        created_at=row["created_at"],
    )


@router.post("/characters", response_model=CharacterResponse)
async def create(character: CharacterCreate):
    data = character.model_dump(by_alias=False)
    row = await create_character(data)
    return _to_response(row)


@router.get("/characters/{character_id}", response_model=CharacterResponse)
async def get(character_id: str):
    row = await get_character(character_id)
    if not row:
        raise HTTPException(status_code=404, detail="Character not found")
    return _to_response(row)
