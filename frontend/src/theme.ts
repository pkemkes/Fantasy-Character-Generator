import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d4a017",
    },
    secondary: {
      main: "#b8860b",
    },
    background: {
      default: "#1a1a2e",
      paper: "#16213e",
    },
  },
  typography: {
    h1: { fontFamily: "'MedievalSharp', cursive" },
    h2: { fontFamily: "'MedievalSharp', cursive" },
    h3: { fontFamily: "'MedievalSharp', cursive" },
    h4: { fontFamily: "'MedievalSharp', cursive" },
    h5: { fontFamily: "'MedievalSharp', cursive" },
    h6: { fontFamily: "'MedievalSharp', cursive" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
