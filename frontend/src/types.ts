export interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  background: string;
  appearance: string;
  profession: string;
  personality_trait: string;
  quirk: string;
  catchphrase: string;
  image_url: string | null;
  created_at: string;
}

export interface Options {
  races: string[];
  classes: string[];
  backgrounds: string[];
  professions: string[];
  personality_traits: string[];
  quirks: string[];
}

export interface Stats {
  images_generated_today: number;
  daily_limit: number;
  remaining: number;
}

export interface CharacterFormData {
  name: string;
  race: string;
  class: string;
  background: string;
  appearance: string;
  profession: string;
  personality_trait: string;
  quirk: string;
  catchphrase: string;
}
