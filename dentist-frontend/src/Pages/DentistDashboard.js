import { Box, Grid } from "@mui/material";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import StatCard from "../Components/StatsCard";
import QuickActions from "../Components/QuickActions";
import Schedule from "../Components/Schedule";
import Activity from "../Components/Activity";
import Reminders from "../Components/Reminders";
import Whatsapp from "../Components/WhatsAppPanel";
import Analytics from "../Components/Analytics";
import FloatingChat from "../Components/FloatingChat";

import {
  CalendarMonth,
  AttachMoney,
  People,
  Warning,
} from "@mui/icons-material";

export default function Dashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        background: "#f7fbff",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 4,
          overflow: "hidden",
        }}
      >
        <Header />

        <Grid container spacing={3} mt={2}>
          <StatCard
            icon={<CalendarMonth />}
            title="Today's Appointments"
            value="18"
            description="1 confirmed, 1 pending"
          />

          <StatCard
            icon={<AttachMoney />}
            title="Weekly Revenue"
            value="$1,815.773"
            description="vs last week"
          />

          <StatCard
            icon={<People />}
            title="Total Patients"
            value="61"
            description="1 registered this month"
          />

          <StatCard
            icon={<Warning />}
            title="Outstanding Balance"
            value="$29,019.559"
            description="9 outstanding invoices"
          />
        </Grid>

        <QuickActions />

        <Schedule />

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} lg={4}>
            <Activity />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Reminders />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Whatsapp />
          </Grid>
        </Grid>

        <Analytics />
      </Box>

      <FloatingChat />
    </Box>
  );
}
