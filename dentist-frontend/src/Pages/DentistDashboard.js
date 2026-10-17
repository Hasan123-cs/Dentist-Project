import { Alert, Box, Button, Grid } from "@mui/material";

import Header from "../Components/Header";
import StatCard from "../Components/StatsCard";
import QuickActions from "../Components/QuickActions";
import Schedule from "../Components/Schedule";
import Analytics from "../Components/Analytics";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarMonth,
  AttachMoney,
  People,
  Warning,
} from "@mui/icons-material";

export default function DentistDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  // const storedUser = localStorage.getItem("user");

  // const user = storedUser ? JSON.parse(storedUser) : {};


  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadError("");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/dashboard`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
            return;
          }

          setLoadError(
            `Dashboard could not load (${response.status}). ${errorText || "Please try again."}`,
          );
          return;
        }

        const data = await response.json();

        console.log(data);

        setDashboardData(data);
      } catch (error) {
        console.error("Dashboard request failed:", error);
        setLoadError(
          "Could not connect to the production API. Check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, token, reloadCount]);
  const isDoctor =
    dashboardData?.userName === "Amany";
  if (loading) {
    return (
      <Box p={4} color="#092c57">
        Loading Dashboard...
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box p={{ xs: 2, sm: 4 }} color="#092c57">
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
        <Button
          variant="contained"
          onClick={() => {
            setLoading(true);
            setLoadError("");
            setReloadCount((count) => count + 1);
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",

        background: "#f7fbff",

        boxSizing: "border-box",

        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <Header dashboardData={dashboardData} />

      {/* STAT CARDS */}

      <Grid
        container
        spacing={3}
        mt={3}
        sx={{
          width: "100%",

          marginLeft: 0,
        }}
      >
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<CalendarMonth />}
            title="Today's Appointments"
            value={dashboardData?.todaysAppointments || 0}
            description={`${dashboardData?.confirmedAppointments || 0} confirmed ${dashboardData?.pendingAppointments || 0
              } pending`}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AttachMoney />}
            title="Weekly Revenue"
            value={dashboardData?.weeklyRevenue || 0}
            description="vs last week"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<People />}
            title="Total Patients"
            value={dashboardData?.totalPatients || 0}
            description={`${dashboardData?.newPatientsMonth || 0} new this month`}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<Warning />}
            title="Outstanding Balance"
            value={dashboardData?.outstandingBalance || 0}
            description="9 outstanding invoices"
          />
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}

      <Box mt={4} width="100%">
        <QuickActions />
      </Box>

      {/* SCHEDULE */}

      <Box mt={4} width="100%">
        <Schedule ScheduleList={dashboardData?.schedule || []} />
      </Box>

      {/* ANALYTICS */}

      {isDoctor && <Box mt={4} width="100%">
        <Analytics analysisList={dashboardData?.analytics || {}} />
      </Box>
      }
    </Box>
  );
}
