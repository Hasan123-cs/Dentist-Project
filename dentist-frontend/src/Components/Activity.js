import { Paper, Typography, Box, Avatar } from "@mui/material";

const list = [
  "Appointment confirmed with Maria Johnson",
  "Treatment plan updated for Jennifer Jones",
  "Appointment scheduled with John Smith",
  "Treatment plan updated for David Rodriguez",
  "Payment received from Lisa Martinez",
];

export default function Activity() {
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
        Recent Activity
      </Typography>

      <Typography fontSize={14} color="text.secondary" mb={3}>
        Latest updates from your practice
      </Typography>

      {list.map((x, i) => (
        <Box key={i} display="flex" gap={2} mb={2}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              background: "#eaf3ff",
              color: "#0755a0",
            }}
          >
            {i + 1}
          </Avatar>

          <Box>
            <Typography fontSize={14}>{x}</Typography>

            <Typography fontSize={12} color="text.secondary">
              {i + 1} hours ago
            </Typography>
          </Box>
        </Box>
      ))}
    </Paper>
  );
}
