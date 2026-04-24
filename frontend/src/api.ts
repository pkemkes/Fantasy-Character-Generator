import type { Character, CharacterFormData, Options, Stats } from "./types";

const BASE = "/api";

export async function fetchOptions(): Promise<Options> {
  const res = await fetch(`${BASE}/options`);
  if (!res.ok) throw new Error("Failed to fetch options");
  return res.json();
}

export async function createCharacter(
  data: CharacterFormData
): Promise<Character> {
  const res = await fetch(`${BASE}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to create character" }));
    throw new Error(err.detail || "Failed to create character");
  }
  return res.json();
}

export async function fetchCharacter(id: string): Promise<Character> {
  const res = await fetch(`${BASE}/characters/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Character not found");
  return res.json();
}

export async function generateImage(
  characterId: string
): Promise<{ image_url: string }> {
  const res = await fetch(
    `${BASE}/characters/${encodeURIComponent(characterId)}/generate-image`,
    { method: "POST" }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Image generation failed" }));
    throw new Error(err.detail || "Image generation failed");
  }
  return res.json();
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
