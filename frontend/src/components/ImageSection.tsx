import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { generateImage, fetchStats } from "../api";
import type { Character, Stats } from "../types";

interface ImageSectionProps {
  character: Character;
  onImageGenerated: () => void;
}

export default function ImageSection({
  character,
  onImageGenerated,
}: ImageSectionProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await generateImage(character.id);
      onImageGenerated();
      fetchStats().then(setStats).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box textAlign="center" sx={{ mt: 3 }}>
      {character.image_url ? (
        <Box
          component="img"
          src={character.image_url}
          alt={`Portrait of ${character.name}`}
          sx={{
            maxWidth: "100%",
            maxHeight: 512,
            borderRadius: 2,
            border: "2px solid",
            borderColor: "primary.dark",
          }}
        />
      ) : (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={
              generating ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AutoFixHighIcon />
              )
            }
            onClick={handleGenerate}
            disabled={generating}
            sx={{ py: 1.5, px: 4 }}
          >
            {generating ? "Generating Portrait..." : "Generate Portrait"}
          </Button>
          {stats && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {stats.remaining} of {stats.daily_limit} generations remaining
              today
            </Typography>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
