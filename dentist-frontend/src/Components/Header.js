import { Box, Typography, Button } from "@mui/material";

export default function Header() {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography color="#2867a8" fontWeight={600} fontSize={16}>
          Wednesday, August 5, 2026
        </Typography>

        <Typography
          sx={{
            fontSize: 42,
            fontWeight: 700,
            color: "#092c57",
          }}
        >
          Good afternoon, dev
        </Typography>

        <Typography fontSize={17} color="text.secondary">
          You have <b>18 appointments</b> scheduled for today • 1 confirmed, 1
          pending
        </Typography>
      </Box>

      <Button
        variant="contained"
        sx={{
          background: "#084889",
          borderRadius: 3,
          px: 4,
          py: 1.5,
          fontWeight: 700,
        }}
      >
        + QUICK ADD
      </Button>
    </Box>
  );
}
