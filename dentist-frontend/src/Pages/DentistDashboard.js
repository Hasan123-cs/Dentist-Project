import { Box, Grid } from "@mui/material";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import StatCard from "../Components/StatsCard";
import QuickActions from "../Components/QuickActions";
import Schedule from "../Components/Schedule";
import Analytics from "../Components/Analytics";

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
        <br></br>
        {/* Stats Cards */}
        <Grid
          container
          spacing={5}
          mt={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
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
        {/* Quick Actions */}
        <QuickActions />
        {/* Today's Schedule */}
        <Schedule />
        {/* Charts */}
        <Analytics />
      </Box>
    </Box>
  );
}
