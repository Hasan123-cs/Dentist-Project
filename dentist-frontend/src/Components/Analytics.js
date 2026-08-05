import { Box, Grid, Paper, Typography } from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const revenue = [
  { name: "Jun 14", value: 2000 },
  { name: "Jun 21", value: 8000 },
  { name: "Jun 28", value: 4000 },
  { name: "Jul 5", value: 1200 },
  { name: "Jul 12", value: 5000 },
  { name: "Jul 19", value: 1000 },
  { name: "Jul 26", value: 3000 },
  { name: "Aug 2", value: 3000 },
];

const status = [
  { name: "Completed", value: 35 },
  { name: "Scheduled", value: 39 },
  { name: "Confirmed", value: 23 },
  { name: "Cancelled", value: 2 },
];

const patients = [
  { name: "Jan", value: 20 },
  { name: "Feb", value: 15 },
  { name: "Mar", value: 0 },
  { name: "Apr", value: 20 },
  { name: "May", value: 35 },
  { name: "Jun", value: 25 },
];

const treatments = [
  { name: "Cleaning", value: 5 },
  { name: "Crown", value: 4 },
  { name: "Root Canal", value: 3 },
  { name: "Filling", value: 2 },
];

const colors = ["#1976d2", "#42a5f5", "#90caf9", "#1565c0"];

function ChartBox({ title, children }) {
  return (
    <Paper
      sx={{
        height: 380,
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5edf5",
      }}
    >
      <Typography fontWeight={700} color="#092c57" mb={2}>
        {title}
      </Typography>

      <Box height="320px">{children}</Box>
    </Paper>
  );
}

export default function Analytics() {
  return (
    <Box mt={5}>
      <Typography fontSize={22} fontWeight={700} color="#092c57" mb={3}>
        Practice Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ChartBox title="Revenue Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line dataKey="value" stroke="#1976d2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ChartBox title="Appointment Status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={status}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                >
                  {status.map((x, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ChartBox title="Patient Growth">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patients}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ChartBox title="Popular Treatments">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatments} layout="vertical">
                <XAxis type="number" />

                <YAxis dataKey="name" type="category" />

                <Tooltip />

                <Bar dataKey="value" fill="#1565c0" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>
      </Grid>
    </Box>
  );
}
