from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CharacterCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    race: str = Field(..., min_length=1, max_length=100)
    class_: str = Field(..., alias="class", min_length=1, max_length=100)
    background: str = Field(..., min_length=1, max_length=100)
    appearance: str = Field("", max_length=500)
    profession: str = Field("", max_length=100)
    personality_trait: str = Field("", max_length=100)
    quirk: str = Field("", max_length=200)
    catchphrase: str = Field("", max_length=300)

    model_config = {"populate_by_name": True}


class CharacterResponse(BaseModel):
    id: str
    name: str
    race: str
    class_: str = Field(..., alias="class")
    background: str
    appearance: str
    profession: str
    personality_trait: str
    quirk: str
    catchphrase: str
    image_url: Optional[str] = None
    created_at: str

    model_config = {"populate_by_name": True}


class OptionsResponse(BaseModel):
    races: list[str]
    classes: list[str]
    backgrounds: list[str]
    professions: list[str]
    personality_traits: list[str]
    quirks: list[str]


class StatsResponse(BaseModel):
    images_generated_today: int
    daily_limit: int
    remaining: int


class ImageGenerateResponse(BaseModel):
    image_url: str
