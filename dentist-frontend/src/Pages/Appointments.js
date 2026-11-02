import { Box, useMediaQuery } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useCallback, useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import AppointmentStats from "../Components/Appointmentstats";
import CalendarToolbar from "../Components/CalendarToolbar";
import WeeklyCalendar from "../Components/WeeklyCalendar";
import AppointmentHeader from "../Components/AppointmentHeader";
import { EmptyState, PageLoading } from "../Components/PageState";
import EventBusy from "@mui/icons-material/EventBusy";

export default function Appointments() {
  const isMobile = useMediaQuery("(max-width:599px)");
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [appointments, setAppointments] = useState([]);

  const [stats, setStats] = useState({
    totalToday: 0,
    completed: 0,
    inProgress: 0,
    scheduled: 0,
  });

  const [view, setView] = useState(isMobile ? "day" : "week");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    setView(isMobile ? "day" : "week");
  }, [isMobile]);

  // LOAD APPOINTMENTS

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setLoadError("");

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
        `${process.env.REACT_APP_API_URL}/api/appointments?start=${start}&end=${end}`,

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
      setLoadError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // CANCEL APPOINTMENT

  const cancelAppointment = async (id) => {
    console.log("Cancel clicked:", id);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/appointments/${id}/cancel`,
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

  const visibleAppointments = appointments.filter((appointment) => {
    const appointmentDate = dayjs(appointment.startDateTime);
    if (view === "day") {
      return appointmentDate.isSame(currentDate, "day");
    }
    if (view === "3days") {
      return (
        appointmentDate.isSame(currentDate, "day") ||
        appointmentDate.isSame(currentDate.add(1, "day"), "day") ||
        appointmentDate.isSame(currentDate.add(2, "day"), "day")
      );
    }
    return true;
  });

  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "100vh",

        background: "#faf8f2",
      }}
    >
      {loading ? (
        <PageLoading label="Loading appointments..." />
      ) : (
        <>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      <AppointmentHeader />

      <AppointmentStats stats={stats} />

      <CalendarToolbar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
      />

      {visibleAppointments.length === 0 && !loadError && (
        <EmptyState
          title="No appointments in this period"
          description="Try another date or add a new appointment."
          icon={EventBusy}
          sx={{ my: 3 }}
        />
      )}

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
        </>
      )}
    </Box>
  );
}