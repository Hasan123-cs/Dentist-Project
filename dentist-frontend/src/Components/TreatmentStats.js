import { Alert, Box, Grid, Paper, Typography } from "@mui/material";
import {
  MedicalServices,
  CheckCircle,
  Pending,
  AttachMoney,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { fetchJsonCached } from "../api/requestCache";
import { PageLoading } from "./PageState";

export default function TreatmentStats() {
  const [treatments, setTreatments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [canViewRevenue, setCanViewRevenue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Sign in to load treatment statistics.");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const loadStatistics = async () => {
      const revenueRequest = fetchJsonCached(
        `${process.env.REACT_APP_API_URL}/api/patients/dashboard-revenue`,
        options,
      ).then(
        (revenueData) => {
          if (!active) return;
          setTotalRevenue(Number(revenueData.totalRevenue) || 0);
          setCanViewRevenue(true);
        },
        (requestError) => {
          if (!active) return;
          if (requestError.status === 403) {
            setCanViewRevenue(false);
          } else {
            console.error("Unable to load treatment revenue.", requestError);
          }
        },
      );

      try {
        const data = await fetchJsonCached(
          `${process.env.REACT_APP_API_URL}/api/patients/all-treatments`,
          options,
        );
        if (active) setTreatments(Array.isArray(data) ? data : []);
      } catch (requestError) {
        console.error("Unable to load treatment statistics.", requestError);
        if (active) setError(requestError.message || "Unable to load treatment statistics.");
      } finally {
        await revenueRequest;
        if (active) setLoading(false);
      }
    };

    loadStatistics();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <PageLoading label="Loading treatment statistics..." />;
  }

  const completedTreatments = treatments.filter(
    (treatment) => treatment.status?.toLowerCase() === "completed",
  ).length;
  const pendingTreatments = treatments.filter(
    (treatment) =>
      treatment.status?.toLowerCase() === "pending" ||
      treatment.status?.toLowerCase() === "needstreatment",
  ).length;
  const formattedRevenue = totalRevenue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const stats = [
    {
      title: "Total Treatments",
      value: treatments.length,
      icon: <MedicalServices />,
      color: "#C9A227",
    },
    {
      title: "Completed",
      value: completedTreatments,
      icon: <CheckCircle />,
      color: "#16a34a",
    },
    {
      title: "Pending",
      value: pendingTreatments,
      icon: <Pending />,
      color: "#f59e0b",
    },
  ];

  if (canViewRevenue) {
    stats.push({
      title: "Total Revenue",
      value: formattedRevenue,
      icon: <AttachMoney />,
      color: "#2563eb",
    });
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3} sx={{ width: "100%", m: 0, mb: 4 }}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                minHeight: 120,
                height: "100%",
                borderRadius: 4,
                border: "1px solid #eee3c5",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                boxShadow: "0 3px 10px rgba(0,0,0,.05)",
              }}
            >
              <Box
                sx={{
                  width: 55,
                  height: 55,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "#faf7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontSize={13} color="#718096">
                  {item.title}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: 23, sm: 28 }, overflowWrap: "anywhere" }}
                  fontWeight={800}
                  color="#092c57"
                >
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
