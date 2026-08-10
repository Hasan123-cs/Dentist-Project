import { Grid, Paper, Typography, Box } from "@mui/material";

import {
  Event,
  CheckCircle,
  AccessTime,
  CalendarMonth,
} from "@mui/icons-material";

const data = [
  {
    title: "Today's Total",
    value: "18",
    icon: <Event />,
    color: "#C9A227",
  },

  {
    title: "Completed",
    value: "8",
    icon: <CheckCircle />,
    color: "#16a34a",
  },

  {
    title: "In Progress",
    value: "3",
    icon: <AccessTime />,
    color: "#f59e0b",
  },

  {
    title: "Scheduled",
    value: "18",
    icon: <CalendarMonth />,
    color: "#2563eb",
  },
];

export default function AppointmentStats() {
  return (
    <Grid container spacing={3} mt={3}>
      {data.map((item) => (
        <Grid item xs={12} sm={6} lg={3} key={item.title}>
          <Paper
            sx={{
              height: 120,

              borderRadius: 4,

              border: "1px solid #eee3c5",

              background: "#fff",

              display: "flex",

              alignItems: "center",

              gap: 2,

              px: 3,

              transition: "0.3s",

              "&:hover": {
                transform: "translateY(-4px)",

                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Box
              sx={{
                width: 50,

                height: 50,

                borderRadius: 3,

                background: "#faf3df",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                color: item.color,
              }}
            >
              {item.icon}
            </Box>

            <Box>
              <Typography fontSize={32} fontWeight={800} color="#3d2f12">
                {item.value}
              </Typography>

              <Typography fontSize={14} fontWeight={600} color="#64748b">
                {item.title}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
