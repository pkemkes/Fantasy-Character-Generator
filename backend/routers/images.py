from fastapi import APIRouter, HTTPException
from models import ImageGenerateResponse
from services.character_service import get_character, update_character_image
from services.image_service import generate_image

router = APIRouter(prefix="/api", tags=["images"])


@router.post(
    "/characters/{character_id}/generate-image",
    response_model=ImageGenerateResponse,
)
async def generate(character_id: str):
    character = await get_character(character_id)
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    try:
        filename = await generate_image(character)
    except ValueError as e:
        raise HTTPException(status_code=429, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    await update_character_image(character_id, filename)
    return ImageGenerateResponse(image_url=f"/api/images/{filename}")
