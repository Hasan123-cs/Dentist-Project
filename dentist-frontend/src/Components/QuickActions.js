import { Grid, Paper, Typography, Box } from "@mui/material";
import { PersonAdd, CalendarMonth } from "@mui/icons-material";
import { Link } from "react-router-dom";

const actions = [
  ["Add Patient", PersonAdd, "/Patients/AddPatient"],
  ["Schedule Appointment", CalendarMonth, "/Schedule"],
];

export default function QuickActions() {
  return (
    <Grid
      container
      spacing={5}
      mt={5}
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {actions.map(([name, Icon, route]) => (
        <Grid item xs={12} sm={6} md={4} key={name} sx={{ width: "12%" }}>
          <Link
            to={route}
            style={{
              textDecoration: "none",
            }}
          >
            <Paper
              sx={{
                height: 120,
                width: "100%",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
                justifyContent: "center",
                gap: 1.5,
                border: "1px solid #e2eaf3",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                "&:hover": {
                  background: "#f8fbff",
                  borderColor: "#1976d2",
                },
              }}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  background: "#eaf3ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ color: "#C9A227" }} />
              </Box>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#092c57",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Typography>
            </Paper>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
