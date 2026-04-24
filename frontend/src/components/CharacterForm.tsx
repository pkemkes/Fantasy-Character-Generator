import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import OptionField from "./OptionField";
import { fetchOptions, createCharacter } from "../api";
import type { Options, CharacterFormData } from "../types";
import { useNavigate } from "react-router-dom";

const EMPTY_FORM: CharacterFormData = {
  name: "",
  race: "",
  class: "",
  background: "",
  appearance: "",
  profession: "",
  personality_trait: "",
  quirk: "",
  catchphrase: "",
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

const RANDOM_NAMES = [
  "Thorn Ironbark",
  "Luna Shadowmere",
  "Grimble Stonefoot",
  "Zara Flamecrest",
  "Bogdan the Unwise",
  "Elara Moonshadow",
  "Ragnar Bonebreaker",
  "Pip Thistledown",
  "Morgana Duskwhisper",
  "Finn Copperkettle",
];

const RANDOM_APPEARANCES = [
  "tall with a scarred left eye and wild red hair",
  "short and stocky with an impressive braided beard",
  "lithe with silver hair and piercing violet eyes",
  "broad-shouldered with tribal tattoos and a warm smile",
  "pale with dark circles under their eyes and ink-stained fingers",
  "muscular with a shaved head and a golden earring",
  "willowy with flowers woven into long green hair",
  "compact and wiry with a perpetual smirk",
];

const RANDOM_CATCHPHRASES = [
  "I cast fireball on Mondays.",
  "My sword does the talking.",
  "That's going in my memoir.",
  "Hold my mead.",
  "I have a bad feeling about this dungeon.",
  "Let me consult the ancient scrolls… just kidding, I'll wing it.",
  "Adventure is just another word for poor planning!",
  "By my grandmother's enchanted ladle!",
];

export default function CharacterForm() {
  const [options, setOptions] = useState<Options | null>(null);
  const [form, setForm] = useState<CharacterFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions().then(setOptions).catch(console.error);
  }, []);

  const set = (field: keyof CharacterFormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const randomize = () => {
    if (!options) return;
    setForm({
      name: pickRandom(RANDOM_NAMES),
      race: pickRandom(options.races),
      class: pickRandom(options.classes),
      background: pickRandom(options.backgrounds),
      appearance: pickRandom(RANDOM_APPEARANCES),
      profession: pickRandom(options.professions),
      personality_trait: pickRandom(options.personality_traits),
      quirk: pickRandom(options.quirks),
      catchphrase: pickRandom(RANDOM_CATCHPHRASES),
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const character = await createCharacter(form);
      navigate(`/character/${character.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create character");
    } finally {
      setSubmitting(false);
    }
  };

  if (!options) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CasinoIcon />}
          onClick={randomize}
          size="large"
          sx={{ borderWidth: 2 }}
        >
          Randomize!
        </Button>
      </Box>

      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => set("name")(e.target.value)}
        required
        fullWidth
        inputProps={{ maxLength: 100 }}
      />

      <OptionField
        label="Race"
        options={options.races}
        value={form.race}
        onChange={set("race")}
      />
      <OptionField
        label="Class"
        options={options.classes}
        value={form.class}
        onChange={set("class")}
      />
      <OptionField
        label="Background"
        options={options.backgrounds}
        value={form.background}
        onChange={set("background")}
      />
      <OptionField
        label="Profession"
        options={options.professions}
        value={form.profession}
        onChange={set("profession")}
      />
      <OptionField
        label="Personality Trait"
        options={options.personality_traits}
        value={form.personality_trait}
        onChange={set("personality_trait")}
      />
      <OptionField
        label="Quirk"
        options={options.quirks}
        value={form.quirk}
        onChange={set("quirk")}
      />
      <TextField
        label="Appearance"
        value={form.appearance}
        onChange={(e) => set("appearance")(e.target.value)}
        multiline
        rows={2}
        fullWidth
        placeholder="Describe your character's look..."
        inputProps={{ maxLength: 500 }}
      />
      <TextField
        label="Catchphrase"
        value={form.catchphrase}
        onChange={(e) => set("catchphrase")(e.target.value)}
        fullWidth
        placeholder="e.g. I cast fireball on Mondays."
        inputProps={{ maxLength: 300 }}
      />

      {error && (
        <Box color="error.main" textAlign="center">
          {error}
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        disabled={submitting}
        sx={{ py: 1.5, fontSize: "1.1rem" }}
      >
        {submitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Create Character"
        )}
      </Button>
    </Stack>
  );
}
