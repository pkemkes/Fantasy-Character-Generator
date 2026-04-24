import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import CreatePage from "./pages/CreatePage";
import ViewPage from "./pages/ViewPage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/character/:id" element={<ViewPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
