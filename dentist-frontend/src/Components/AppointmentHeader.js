import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AppointmentHeader() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      mb={3}
    >
      <Box>
        <Typography
          sx={{ fontSize: { xs: 24, sm: 30 }, fontWeight: 800 }}
          color="#3d2f12"
        >
          Appointments
        </Typography>

        <Typography color="#8a7a55">
          Manage your scheduling and appointments
        </Typography>
      </Box>

      <Button
        variant="contained"
        sx={{
          background: "#C9A227",

          fontWeight: 700,

          px: { xs: 2, sm: 3 },
          width: { xs: "100%", sm: "auto" },
          whiteSpace: "nowrap",

          "&:hover": {
            background: "#A88418",
          },
        }}
        onClick={() => navigate("/appointments/new")}
      >
        + New Appointment
      </Button>
    </Box>
  );
}
