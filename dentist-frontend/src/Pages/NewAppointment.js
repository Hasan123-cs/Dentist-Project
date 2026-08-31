import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function NewAppointment() {
  // generate the hours 9-> 9:30 ..

  const generateTimeSlots = () => {
    const slots = [];

    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) break;

        const hourString = String(hour).padStart(2, "0");

        const minuteString = String(minute).padStart(2, "0");

        slots.push(`${hourString}:${minuteString}`);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // states

  const [error, setError] = useState("");

  const [timeError, setTimeError] = useState("");

  const [appointmentsForDate, setAppointmentsForDate] = useState([]);

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    patientName: "",

    treatmentName: "",

    date: "",

    time: "",
  });

  // fetch data to know where canot appear

  useEffect(() => {
    if (!appointment.date) {
      setAppointmentsForDate([]);

      return;
    }

    const loadAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://localhost:7166/api/Appointments?start=${appointment.date}T00:00:00&end=${appointment.date}T23:59:59`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.log(data);

          return;
        }

        setAppointmentsForDate(data.appointments || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadAppointments();
  }, [appointment.date]);

  // checl if time blocked

  const isTimeAlreadyBooked = () => {
    return appointmentsForDate.some((app) => {
      const appTime = app.startTime?.substring(0, 5);

      return (
        appTime === appointment.time &&
        app.status?.toLowerCase() !== "cancelled"
      );
    });
  };

  const isInvalidTime = () => {
    if (!appointment.time) return false;

    const [hour, minute] = appointment.time.split(":").map(Number);

    const totalMinutes = hour * 60 + minute;

    return totalMinutes < 9 * 60 || totalMinutes > 20 * 60;
  };

  const isSelectedTimeBooked = isTimeAlreadyBooked();
  const invalidTime = isInvalidTime();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppointment({
      ...appointment,

      [name]: value,
    });

    if (error) {
      setError("");
    }

    if (name === "time") {
      if (value < "09:00" || value > "20:00") {
        setTimeError("Appointment time must be between 09:00 AM and 08:00 PM.");
      } else {
        setTimeError("");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setError("");

      // Check time

      if (
        !appointment.time ||
        appointment.time < "09:00" ||
        appointment.time > "20:00"
      ) {
        setTimeError("Appointment time must be between 09:00 AM and 08:00 PM.");

        return;
      }

      setTimeError("");

      // Check if time is already booked

      if (isTimeAlreadyBooked()) {
        setError("This time is already booked.");

        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");

        navigate("/login");

        return;
      }

      const appointmentToSend = {
        ...appointment,

        time: `${appointment.time}:00`,
      };

      const response = await fetch("https://localhost:7166/api/Appointments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(appointmentToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create appointment.");

        console.log(data);

        return;
      }

      console.log("Appointment created:", data);

      navigate("/appointments");
    } catch (error) {
      setError("Unable to connect to the server.");

      console.error("Error creating appointment:", error);
    }
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

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
            }}
          >
            {error}
          </Alert>
        )}

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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Appointment Time"
            value={
              appointment.time ? dayjs(`2000-01-01 ${appointment.time}`) : null
            }
            onChange={(newValue) => {
              const selectedTime = newValue ? newValue.format("HH:mm") : "";

              setAppointment({
                ...appointment,
                time: selectedTime,
              });

              setError("");
            }}
            minutesStep={30}
            timeSteps={{
              minutes: 30,
            }}
            slotProps={{
              textField: {
                fullWidth: true,

                error: invalidTime || isSelectedTimeBooked,

                helperText: invalidTime
                  ? "Invalid time. We are closed at this time."
                  : isSelectedTimeBooked
                    ? "There is already a scheduled appointment at this time."
                    : "",

                sx: { mb: 3 },
              },
            }}
          />
        </LocalizationProvider>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !appointment.patientName ||
            !appointment.treatmentName ||
            !appointment.date ||
            !appointment.time ||
            invalidTime ||
            isSelectedTimeBooked
          }
          sx={{
            background: "#C9A227",
          }}
        >
          SAVE APPOINTMENT
        </Button>
      </Paper>
      <Button
        variant="outlined"
        onClick={() => navigate("/appointments")}
        sx={{
          position: "absolute",
          bottom: 250,
          right: 100,
          borderColor: "#C9A227",
          color: "#8a6d1d",
          fontWeight: 700,
          borderRadius: 2,
          px: 2,
        }}
      >
        ← BACK
      </Button>
    </Box>
  );
}
