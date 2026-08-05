import { Fab } from "@mui/material";

import { Chat } from "@mui/icons-material";

export default function FloatingChat() {
  return (
    <Fab
      sx={{
        position: "fixed",
        right: 30,
        bottom: 30,
        background: "#0755a0",
        color: "white",
        "&:hover": {
          background: "#063d78",
        },
      }}
    >
      <Chat />
    </Fab>
  );
}
