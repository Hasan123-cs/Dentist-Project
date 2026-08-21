import { Box } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import AppointmentStats from "../Components/Appointmentstats";
import CalendarToolbar from "../Components/CalendarToolbar";
import WeeklyCalendar from "../Components/WeeklyCalendar";
import AppointmentHeader from "../Components/AppointmentHeader";

export default function Appointments() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [view, setView] = useState("week");

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

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
    console.log(token);
    try {
      const response = await axios.get(
        `https://localhost:7166/api/appointments?start=${start}&end=${end}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Fetched Data:", response.data);
      setAppointments(response.data.appointments);
      setStats({
        totalToday: response.data.totalToday,
        completed: response.data.completed,
        inProgress: response.data.inProgress,
        scheduled: response.data.scheduled,
      });
      console.log(stats);
    } catch (error) {
      console.log("Error fetching appointments:", error);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#faf8f2",
        boxSizing: "border-box",
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
      />
    </Box>
  );
}
