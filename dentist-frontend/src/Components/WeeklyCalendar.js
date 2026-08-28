import { Box, Paper } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import axios from "axios";
import AppointmentCard from "../Components/AppointmentCard";

const times = [
  "09:00",
  "09:30",

  "10:00",
  "10:30",

  "11:00",
  "11:30",

  "12:00",
  "12:30",

  "13:00",
  "13:30",

  "14:00",
  "14:30",

  "15:00",
  "15:30",

  "16:00",
  "16:30",

  "17:00",
  "17:30",

  "18:00",
  "18:30",

  "19:00",
  "19:30",

  "20:00",
];

export default function WeeklyCalendar({
  currentDate,
  view,
  appointments,
  setAppointments,
  cancelAppointment,
}) {
  const [draggedAppointment, setDraggedAppointment] = useState(null);

  const startOfWeek = currentDate.startOf("week").add(1, "day");

  let days = [];

  if (view === "day") {
    days = [currentDate];
  } else if (view === "3days") {
    days = [currentDate, currentDate.add(1, "day"), currentDate.add(2, "day")];
  } else {
    days = Array.from(
      { length: 7 },

      (_, i) => startOfWeek.add(i, "day"),
    );
  }

  const getAppointmentDuration = (appointment) => {
    const start = dayjs(appointment.startDateTime);

    const end = dayjs(appointment.endDateTime);

    return end.diff(start, "minute") || 30;
  };

  const handleDrop = async (day, time) => {
    if (!draggedAppointment) return;

    const appointment = draggedAppointment;

    const oldStart = appointment.startDateTime;

    const oldEnd = appointment.endDateTime;

    const duration = getAppointmentDuration(appointment);

    const newStart = dayjs(`${day.format("YYYY-MM-DD")} ${time}`);

    const newEnd = newStart.add(
      duration,

      "minute",
    );

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

      await axios.put(
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
    } catch (error) {
      console.log(error);

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
    }
  };

  return (
    <Paper
      sx={{
        mt: 3,

        borderRadius: 4,

        overflow: "visible",

        border: "1px solid #eee3c5",

        background: "#fff",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: `80px repeat(${days.length},1fr)`,
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

            gridTemplateColumns: `80px repeat(${days.length},1fr)`,

            height: 60,
          }}
        >
          {/* TIME */}

          <Box
            sx={{
              display: "flex",

              justifyContent: "center",

              alignItems: "flex-start",

              pt: 1,

              fontSize: 13,
            }}
          >
            {time}
          </Box>

          {days.map((day) => {
            const cellAppointments = appointments.filter((app) => {
              const date = dayjs(app.startDateTime);

              return (
                date.format("YYYY-MM-DD") === day.format("YYYY-MM-DD") &&
                date.format("HH:mm") === time
              );
            });

            return (
              <Box
                key={day.format("YYYY-MM-DD")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(day, time)}
                sx={{
                  borderLeft: "1px solid #eee3c5",

                  borderTop: "1px solid #eee3c5",

                  position: "relative",

                  p: 0.5,

                  overflow: "visible",
                }}
              >
                {cellAppointments.map((app, index) => {
                  const duration = getAppointmentDuration(app);

                  return (
                    <Box
                      key={app.id}
                      sx={{
                        position: "absolute",

                        top: 0,

                        left: `${(index * 100) / cellAppointments.length}%`,

                        width: `${100 / cellAppointments.length}%`,

                        height: `${(duration / 30) * 60}px`,

                        zIndex: 10,
                      }}
                    >
                      <AppointmentCard
                        appointment={app}
                        onDragStart={(appointment) => {
                          setDraggedAppointment(appointment);
                        }}
                        cancelAppointment={cancelAppointment}
                      />
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      ))}
    </Paper>
  );
}