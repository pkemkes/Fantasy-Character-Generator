import { useState } from "react";
import { Button, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function ShareButton() {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopy}
      >
        Share Character
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Link copied to clipboard!"
      />
    </>
  );
}
