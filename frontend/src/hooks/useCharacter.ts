import { useEffect, useState } from "react";
import { fetchCharacter } from "../api";
import type { Character } from "../types";

export function useCharacter(id: string | undefined) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCharacter(id)
      .then(setCharacter)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const refresh = () => {
    if (!id) return;
    fetchCharacter(id).then(setCharacter).catch(() => {});
  };

  return { character, loading, error, refresh };
}
