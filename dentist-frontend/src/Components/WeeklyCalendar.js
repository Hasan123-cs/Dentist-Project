import { Box, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import AppointmentCard from "../Components/AppointmentCard";
import axios from "axios";
const times = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function WeeklyCalendar({
  currentDate,
  view,
  appointments,
  setAppointments,
}) {
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [message, setMessage] = useState("");
  const startOfWeek = currentDate.startOf("week").add(1, "day");

  let days = [];

  if (view === "day") {
    days = [currentDate];
  } else if (view === "3days") {
    days = [currentDate, currentDate.add(1, "day"), currentDate.add(2, "day")];
  } else {
    days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
  }
  // methode for drag and drop
  const handleDrop = async (day, time) => {
    if (!draggedAppointment) return;

    const appointment = draggedAppointment;

    const oldStart = appointment.startDateTime;
    const oldEnd = appointment.endDateTime;

    const oldDuration = getAppointmentDuration(appointment);

    const newStart = dayjs(`${day.format("YYYY-MM-DD")} ${time}`);

    const newEnd = newStart.add(oldDuration, "minute");

    // Update UI immediately
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === appointment.id
          ? {
              ...item,
              startDateTime: newStart.toISOString(),
              endDateTime: newEnd.toISOString(),
            }
          : item,
      ),
    );

    setDraggedAppointment(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://localhost:7166/api/appointments/${appointment.id}/time`,
        {
          startDateTime: newStart.toISOString(),
          endDateTime: newEnd.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("success");
    } catch (error) {
      console.log(
        "Failed to update appointment:",
        error.response?.data?.message,
      );
      console.log(message);
      // use it only for errors
      setMessage(error.response?.data?.message);
      // Rollback if backend fails
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === appointment.id
            ? {
                ...item,
                startDateTime: oldStart,
                endDateTime: oldEnd,
              }
            : item,
        ),
      );

      alert("Failed to update appointment" + " cause : " + message);
    }
  };
  // === drag drop methode ===
  const getAppointmentDuration = (appointment) => {
    const startStr =
      appointment.startDateTime ||
      `${appointment.appointmentDate} ${appointment.startTime}`;
    const endStr =
      appointment.endDateTime ||
      `${appointment.appointmentDate} ${appointment.endTime}`;
    return dayjs(endStr).diff(dayjs(startStr), "minute") || 30;
  };

  return (
    <Paper
      sx={{
        mt: 3,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #eee3c5",
        background: "#fff",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
        }}
      >
        <Box />

        {days.map((day) => (
          <Box
            key={day.format("YYYY-MM-DD")}
            sx={{
              p: 2,
              textAlign: "center",
              borderLeft: "1px solid #eee3c5",
              fontWeight: 700,
            }}
          >
            {day.format("ddd")}
            <br />
            {day.format("D")}
          </Box>
        ))}
      </Box>

      {/* BODY */}

      {times.map((time) => (
        <Box
          key={time}
          sx={{
            display: "grid",
            gridTemplateColumns: `80px repeat(${days.length}, 1fr)`,
            height: 80,
          }}
        >
          {/* TIME */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 1,
              fontSize: 14,
            }}
          >
            {time}
          </Box>

          {/* DAYS */}

          {days.map((day) => {
            const cellAppointments = appointments.filter((item) => {
              const startVal =
                item.startDateTime ||
                `${item.appointmentDate} ${item.startTime}`;
              const appDate = dayjs(startVal);

              return (
                appDate.format("YYYY-MM-DD") === day.format("YYYY-MM-DD") &&
                appDate.format("HH:00") === time
              );
            });

            return (
              <Box
                key={day.format("YYYY-MM-DD")}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={() => {
                  handleDrop(day, time);
                }}
                sx={{
                  borderLeft: "1px solid #eee3c5",
                  borderTop: "1px solid #eee3c5",
                  p: 0.5,
                  display: "flex",
                  gap: 0.5,
                  overflow: "hidden",
                }}
              >
                {cellAppointments.map((app) => (
                  <Box
                    key={app.id}
                    sx={{
                      width: `${100 / cellAppointments.length}%`,
                    }}
                  >
                    <AppointmentCard
                      appointment={app}
                      onDragStart={(appointment) => {
                        setDraggedAppointment(appointment);
                      }}
                    />
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
      ))}
    </Paper>
  );
}
