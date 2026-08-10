import { Box, TextField, Button, Paper, Typography } from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function NewAppointment() {
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    patientName: "",
    treatmentName: "",
    date: "",
    time: "",
    status: "Scheduled",
  });

  const handleChange = (e) => {
    setAppointment({
      ...appointment,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(appointment);

    // later:
    // axios.post("/api/appointments", appointment)
  };

  return (
    <Box
      sx={{
        p: 4,
        background: "#faf8f2",
        minHeight: "100vh",
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography fontSize={28} fontWeight={800} mb={3}>
          New Appointment
        </Typography>

        <TextField
          fullWidth
          name="patientName"
          label="Patient Name"
          value={appointment.patientName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          name="treatmentName"
          label="Treatment Name"
          value={appointment.treatmentName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="date"
          name="date"
          value={appointment.date}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="time"
          name="time"
          value={appointment.time}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "#C9A227",
          }}
        >
          Save Appointment
        </Button>
      </Paper>
      <Button
        variant="outlined"
        onClick={() => navigate("/appointments")}
        sx={{
          position: "absolute",
          left: 20,
          top: 500,
          mb: 3,
          borderColor: "#C9A227",
          color: "#8a6d1d",
          fontWeight: 700,
        }}
      >
        ← BACK
      </Button>
    </Box>
  );
}
