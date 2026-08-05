import { Paper, Typography, Box, Button, Chip } from "@mui/material";

const messages = [
  {
    name: "Emma Davis",
    text: "Hello Emma, checking after your cavity filling yesterday",
  },
  {
    name: "James Wilson",
    text: "Checking after your crown placement",
  },
];

export default function WhatsAppPanel() {
  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 4,
        border: "1px solid #e5edf5",
      }}
    >
      <Typography fontWeight={700} fontSize={18} color="#092c57">
        WhatsApp Messages (Today)
      </Typography>

      <Box display="flex" gap={1} mt={2}>
        <Chip label="4 Overdue" color="error" size="small" />

        <Chip label="4 Pending" color="warning" size="small" />
      </Box>

      {messages.map((msg) => (
        <Box
          key={msg.name}
          sx={{
            mt: 3,
            p: 2,
            border: "1px solid #ffcdd2",
            borderRadius: 3,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={700}>{msg.name}</Typography>

            <Chip label="Overdue" color="error" size="small" />
          </Box>

          <Typography fontSize={14} mt={2} color="text.secondary">
            {msg.text}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              background: "#0755a0",
              borderRadius: 2,
            }}
          >
            Send via WhatsApp
          </Button>
        </Box>
      ))}
    </Paper>
  );
}
