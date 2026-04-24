import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  Divider,
} from "@mui/material";
import type { Character } from "../types";

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)",
        border: "1px solid",
        borderColor: "primary.dark",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h3" color="primary" gutterBottom textAlign="center">
          {character.name}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 2 }}
        >
          {character.race && <Chip label={character.race} color="primary" variant="outlined" />}
          {character.class && <Chip label={character.class} color="primary" variant="outlined" />}
          {character.background && (
            <Chip label={character.background} color="secondary" variant="outlined" />
          )}
          {character.profession && (
            <Chip label={character.profession} color="secondary" variant="outlined" />
          )}
        </Stack>

        <Divider sx={{ my: 2, borderColor: "primary.dark" }} />

        <Stack spacing={1.5}>
          {character.personality_trait && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Personality
              </Typography>
              <Typography>{character.personality_trait}</Typography>
            </Box>
          )}

          {character.quirk && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Quirk
              </Typography>
              <Typography>{character.quirk}</Typography>
            </Box>
          )}

          {character.appearance && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Appearance
              </Typography>
              <Typography>{character.appearance}</Typography>
            </Box>
          )}

          {character.catchphrase && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderLeft: "3px solid",
                borderColor: "primary.main",
                fontStyle: "italic",
              }}
            >
              <Typography variant="body1">
                "{character.catchphrase}"
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
