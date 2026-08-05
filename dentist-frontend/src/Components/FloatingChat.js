import { Fab } from "@mui/material";

import { Chat } from "@mui/icons-material";

export default function FloatingChat() {
  return (
    <Fab
      sx={{
        position: "fixed",
        right: 30,
        bottom: 30,
        background: "#C9A227",
        color: "white",
        "&:hover": {
          background: "#8B6B1F",
        },
      }}
    >
      <Chat />
    </Fab>
  );
}
