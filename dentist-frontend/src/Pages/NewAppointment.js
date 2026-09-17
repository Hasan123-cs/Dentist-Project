import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function NewAppointment() {
  // =========================
  // API
  // =========================

  const APPOINTMENTS_API = "https://localhost:7166/api/Appointments";

  // =========================
  // Generate time slots
  // 09:00 -> 09:30 -> ... -> 20:00
  // =========================

  const generateTimeSlots = () => {
    const slots = [];

    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) {
          break;
        }

        const hourString = String(hour).padStart(2, "0");
        const minuteString = String(minute).padStart(2, "0");

        slots.push(`${hourString}:${minuteString}`);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // =========================
  // States
  // =========================

  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");

  const [appointmentsForDate, setAppointmentsForDate] = useState([]);

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    patientName: "",
    treatmentName: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // =========================
  // Convert HH:mm to minutes
  // =========================

  const timeToMinutes = (time) => {
    if (!time) return null;

    const [hour, minute] = time.split(":").map(Number);

    return hour * 60 + minute;
  };

  // =========================
  // Convert minutes to HH:mm
  // =========================

  const minutesToTime = (totalMinutes) => {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0",
    )}`;
  };

  // =========================
  // Fetch appointments for date
  // =========================

  useEffect(() => {
    if (!appointment.date) {
      setAppointmentsForDate([]);
      return;
    }

    const loadAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${APPOINTMENTS_API}?start=${appointment.date}T00:00:00&end=${appointment.date}T23:59:59`,
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
        console.error("Error loading appointments:", error);
      }
    };

    loadAppointments();
  }, [appointment.date, navigate]);

  // =========================
  // Get existing appointment start
  // =========================

  const getAppointmentStartMinutes = (app) => {
    const start = app.startDateTime || app.StartDateTime;

    if (!start) {
      return null;
    }

    const date = dayjs(start);

    if (!date.isValid()) {
      return null;
    }

    return date.hour() * 60 + date.minute();
  };

  // =========================
  // Get existing appointment end
  // =========================

  const getAppointmentEndMinutes = (app) => {
    const end = app.endDateTime || app.EndDateTime;

    if (!end) {
      return null;
    }

    const date = dayjs(end);

    if (!date.isValid()) {
      return null;
    }

    return date.hour() * 60 + date.minute();
  };

  // =========================
  // Check appointment overlap
  // =========================

  const isTimeAlreadyBooked = () => {
    if (!appointment.startTime || !appointment.endTime) {
      return false;
    }

    const newStart = timeToMinutes(appointment.startTime);

    const newEnd = timeToMinutes(appointment.endTime);

    if (newStart === null || newEnd === null) {
      return false;
    }

    return appointmentsForDate.some((app) => {
      // Cancelled appointments don't block time
      if (app.status?.toLowerCase() === "cancelled") {
        return false;
      }

      const existingStart = getAppointmentStartMinutes(app);

      const existingEnd = getAppointmentEndMinutes(app);

      if (existingStart === null || existingEnd === null) {
        return false;
      }

      /*
        Overlap rule:

        New:
        newStart -> newEnd

        Existing:
        existingStart -> existingEnd

        They overlap when:

        newStart < existingEnd
        &&
        newEnd > existingStart
      */

      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  // =========================
  // Validate time
  // =========================

  const isInvalidTime = () => {
    if (!appointment.startTime || !appointment.endTime) {
      return false;
    }

    const start = timeToMinutes(appointment.startTime);

    const end = timeToMinutes(appointment.endTime);

    if (start === null || end === null) {
      return false;
    }

    // Clinic opens at 09:00
    if (start < 9 * 60) {
      return true;
    }

    // Clinic closes at 20:00
    if (end > 20 * 60) {
      return true;
    }

    // End must be after start
    if (end <= start) {
      return true;
    }

    return false;
  };

  const isSelectedTimeBooked = isTimeAlreadyBooked();

  const invalidTime = isInvalidTime();

  // =========================
  // Handle normal fields
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppointment({
      ...appointment,
      [name]: value,
    });

    setError("");
    setTimeError("");
  };

  // =========================
  // Handle Start Time
  // =========================

  const handleStartTimeChange = (newValue) => {
    const selectedTime = newValue ? newValue.format("HH:mm") : "";

    setAppointment({
      ...appointment,
      startTime: selectedTime,
    });

    setError("");
    setTimeError("");
  };

  // =========================
  // Handle End Time
  // =========================

  const handleEndTimeChange = (newValue) => {
    const selectedTime = newValue ? newValue.format("HH:mm") : "";

    setAppointment({
      ...appointment,
      endTime: selectedTime,
    });

    setError("");
    setTimeError("");
  };

  // =========================
  // Handle submit
  // =========================

  const handleSubmit = async () => {
    try {
      setError("");
      setTimeError("");

      // =========================
      // Patient validation
      // =========================

      if (!appointment.patientName.trim()) {
        setError("Please enter patient name.");
        return;
      }

      // =========================
      // Treatment validation
      // =========================

      if (!appointment.treatmentName.trim()) {
        setError("Please enter treatment name.");
        return;
      }

      // =========================
      // Date validation
      // =========================

      if (!appointment.date) {
        setError("Please select appointment date.");
        return;
      }

      // =========================
      // Start time validation
      // =========================

      if (!appointment.startTime) {
        setTimeError("Please select start time.");
        return;
      }

      // =========================
      // End time validation
      // =========================

      if (!appointment.endTime) {
        setTimeError("Please select end time.");
        return;
      }

      // =========================
      // Validate time range
      // =========================

      const start = timeToMinutes(appointment.startTime);

      const end = timeToMinutes(appointment.endTime);

      if (start === null || end === null) {
        setTimeError("Invalid appointment time.");
        return;
      }

      if (start < 9 * 60) {
        setTimeError("Start time cannot be before 09:00 AM.");
        return;
      }

      if (end > 20 * 60) {
        setTimeError("End time cannot be after 08:00 PM.");
        return;
      }

      if (end <= start) {
        setTimeError("End time must be after start time.");
        return;
      }

      // =========================
      // Check overlap
      // =========================

      if (isTimeAlreadyBooked()) {
        setError("This appointment overlaps with an existing appointment.");
        return;
      }

      // =========================
      // Authentication
      // =========================

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");

        navigate("/login");
        return;
      }

      // =========================
      // Prepare data
      // =========================

      /*
        IMPORTANT:

        We are now sending BOTH:

        startTime
        endTime

        The backend will later be changed
        to receive these values.
      */

      const appointmentToSend = {
        patientName: appointment.patientName.trim(),

        treatmentName: appointment.treatmentName.trim(),

        date: appointment.date,

        startTime: `${appointment.startTime}:00`,

        endTime: `${appointment.endTime}:00`,
      };

      console.log("Appointment being sent:", appointmentToSend);

      // =========================
      // POST
      // =========================

      const response = await fetch(APPOINTMENTS_API, {
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
      console.error("Error creating appointment:", error);

      setError("Unable to connect to the server.");
    }
  };

  // =========================
  // UI
  // =========================

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

        {/* =========================
            Error
        ========================= */}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* =========================
            Patient Name
        ========================= */}

        <TextField
          fullWidth
          name="patientName"
          label="Patient Name"
          value={appointment.patientName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* =========================
            Treatment Name
        ========================= */}

        <TextField
          fullWidth
          name="treatmentName"
          label="Treatment Name"
          value={appointment.treatmentName}
          onChange={handleChange}
          placeholder="Example: Root Canal"
          sx={{ mb: 2 }}
        />

        {/* =========================
            Date
        ========================= */}

        <TextField
          fullWidth
          type="date"
          name="date"
          value={appointment.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />

        {/* =========================
            Start Time
        ========================= */}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Start Time"
            value={
              appointment.startTime
                ? dayjs(`2000-01-01 ${appointment.startTime}`)
                : null
            }
            onChange={handleStartTimeChange}
            minutesStep={30}
            timeSteps={{
              minutes: 30,
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: invalidTime || isSelectedTimeBooked || !!timeError,
                helperText:
                  timeError ||
                  (isSelectedTimeBooked
                    ? "This time overlaps with another appointment."
                    : ""),
                sx: {
                  mb: 2,
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* =========================
            End Time
        ========================= */}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="End Time"
            value={
              appointment.endTime
                ? dayjs(`2000-01-01 ${appointment.endTime}`)
                : null
            }
            onChange={handleEndTimeChange}
            minutesStep={30}
            timeSteps={{
              minutes: 30,
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: invalidTime || isSelectedTimeBooked || !!timeError,
                helperText:
                  invalidTime && appointment.startTime && appointment.endTime
                    ? "End time must be after start time and cannot be after 08:00 PM."
                    : "",
                sx: {
                  mb: 3,
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* =========================
            Schedule Preview
        ========================= */}

        {appointment.startTime &&
          appointment.endTime &&
          !invalidTime &&
          !isSelectedTimeBooked && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <strong>Appointment Schedule</strong>
              <br />
              {appointment.startTime} → {appointment.endTime}
            </Alert>
          )}

        {/* =========================
            Save
        ========================= */}

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !appointment.patientName.trim() ||
            !appointment.treatmentName.trim() ||
            !appointment.date ||
            !appointment.startTime ||
            !appointment.endTime ||
            invalidTime ||
            isSelectedTimeBooked
          }
          sx={{
            background: "#C9A227",

            "&:hover": {
              background: "#b8911f",
            },
          }}
        >
          SAVE APPOINTMENT
        </Button>
      </Paper>

      {/* =========================
          Back
      ========================= */}

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
