import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCharacter } from "../hooks/useCharacter";
import CharacterCard from "../components/CharacterCard";
import ImageSection from "../components/ImageSection";
import ShareButton from "../components/ShareButton";

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const { character, loading, error, refresh } = useCharacter(id);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !character) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" color="error" gutterBottom>
          {error || "Character not found"}
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Create a Character
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <CharacterCard character={character} />
      <ImageSection character={character} onImageGenerated={refresh} />

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <ShareButton />
        <Button
          component={Link}
          to="/"
          variant="outlined"
          color="secondary"
          startIcon={<AddIcon />}
        >
          Create Your Own
        </Button>
      </Stack>
    </Container>
  );
}
