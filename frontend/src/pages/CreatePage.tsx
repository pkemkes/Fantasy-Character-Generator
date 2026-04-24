import { Box, Container, Typography } from "@mui/material";
import CharacterForm from "../components/CharacterForm";

export default function CreatePage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" color="primary" gutterBottom>
          Fantasy Character Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Build your fantasy alter ego in 30 seconds!
        </Typography>
      </Box>
      <CharacterForm />
    </Container>
  );
}
