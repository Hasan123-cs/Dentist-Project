import { Box } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import AppointmentStats from "../Components/Appointmentstats";
import CalendarToolbar from "../Components/CalendarToolbar";
import WeeklyCalendar from "../Components/WeeklyCalendar";
import AppointmentHeader from "../Components/AppointmentHeader";

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [appointments, setAppointments] = useState([]);

  const [stats, setStats] = useState({});

  const [view, setView] = useState("week");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  // LOAD APPOINTMENTS

  const loadAppointments = async () => {
    const start = currentDate
      .startOf("week")
      .add(1, "day")
      .startOf("day")
      .toISOString();

    const end = currentDate
      .startOf("week")
      .add(7, "day")
      .endOf("day")
      .toISOString();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://localhost:7166/api/appointments?start=${start}&end=${end}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAppointments(response.data.appointments || []);

      setStats({
        totalToday: response.data.totalToday || 0,

        completed: response.data.completed || 0,

        inProgress: response.data.inProgress || 0,

        scheduled: response.data.scheduled || 0,
      });
    } catch (error) {
      console.log(
        "Load appointments error:",
        error.response?.data || error.message,
      );
    }
  };

  // CANCEL APPOINTMENT

  const cancelAppointment = async (id) => {
    console.log("Cancel clicked:", id);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `https://localhost:7166/api/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status: "Cancelled",
              }
            : app,
        ),
      );
      setNotification({
        open: true,
        message: response.data.message || "Appointment cancelled successfully.",
        severity: "success",
      });
      console.log("Appointment cancelled");
    } catch (error) {
      console.log(
        "Cancel error:",

        error.response?.data || error.message,
      );
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Failed to cancel appointment.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "100vh",

        background: "#faf8f2",
      }}
    >
      <AppointmentHeader />

      <AppointmentStats stats={stats} />

      <CalendarToolbar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
      />

      <WeeklyCalendar
        currentDate={currentDate}
        view={view}
        appointments={appointments}
        setAppointments={setAppointments}
        cancelAppointment={cancelAppointment}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}