import { Paper, Typography, Box, Button } from "@mui/material";

import { Notifications } from "@mui/icons-material";

export default function Reminders() {
  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 4,
        border: "1px solid #e5edf5",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Notifications
          sx={{
            color: "#0755a0",
          }}
        />

        <Typography fontWeight={700} fontSize={18} color="#092c57">
          Today's Reminders
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 3,
          background: "#fff8e6",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Typography fontWeight={700}>Patient follow-up</Typography>

        <Typography fontSize={14} color="text.secondary" mt={1}>
          Call Emma Davis after treatment
        </Typography>
      </Box>

      <Button
        sx={{
          mt: 3,
          fontWeight: 700,
          color: "#0755a0",
        }}
      >
        View all reminders →
      </Button>
    </Paper>
  );
}
