import { Grid, Paper, Typography, Box } from "@mui/material";

import {
  PersonAdd,
  CalendarMonth,
  ReceiptLong,
  Payments,
} from "@mui/icons-material";

const actions = [
  ["Add Patient", PersonAdd],
  ["Schedule Appointment", CalendarMonth],
  ["Create Invoice", ReceiptLong],
  ["Record Payment", Payments],
];

export default function QuickActions() {
  return (
    <Grid container spacing={3} mt={3}>
      {actions.map(([name, Icon]) => (
        <Grid item xs={12} sm={6} lg={3} key={name}>
          <Paper
            sx={{
              height: 110,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flexDirection: "column",
              border: "1px solid #e5edf5",
              cursor: "pointer",
              "&:hover": {
                background: "#f5faff",
              },
            }}
          >
            <Box
              sx={{
                background: "#eaf3ff",
                color: "#0755a0",
                width: 45,
                height: 45,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon />
            </Box>

            <Typography fontWeight={700} fontSize={14} color="#092c57">
              {name}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
