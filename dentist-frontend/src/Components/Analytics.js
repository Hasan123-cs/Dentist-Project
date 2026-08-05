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
  {
    name: "Completed",
    value: 35,
  },
  {
    name: "Scheduled",
    value: 39,
  },
  {
    name: "Confirmed",
    value: 23,
  },
  {
    name: "Cancelled",
    value: 2,
  },
];

const patients = [
  {
    name: "Jan",
    value: 20,
  },
  {
    name: "Feb",
    value: 15,
  },
  {
    name: "Mar",
    value: 0,
  },
  {
    name: "Apr",
    value: 20,
  },
  {
    name: "May",
    value: 35,
  },
  {
    name: "Jun",
    value: 25,
  },
];

const treatments = [
  {
    name: "Cleaning",
    value: 5,
  },
  {
    name: "Crown",
    value: 4,
  },
  {
    name: "Root Canal",
    value: 3,
  },
  {
    name: "Filling",
    value: 2,
  },
];

const colors = ["#C9A227", "#D4AF37", "#E5C565", "#8B6B1F"];

function ChartBox({ title, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: 420,
        p: 3,
        width: "100%",
        borderRadius: 4,
        border: "1px solid #eee3c5",
        background: "#fff",
      }}
    >
      <Typography fontSize={18} fontWeight={700} color="#3d2f12" mb={2}>
        {title}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 340,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

export default function Analytics() {
  return (
    <Box mt={6}>
      <Typography fontSize={24} fontWeight={800} color="#3d2f12" mb={3}>
        Practice Analytics
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Revenue */}

        <Grid item xs={12} md={6}>
          <ChartBox title="Revenue Trend">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#C9A227"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        {/* Appointment */}

        <Grid item xs={12} md={6}>
          <ChartBox title="Appointment Status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={status}
                  dataKey="value"
                  innerRadius={75}
                  outerRadius={120}
                  paddingAngle={5}
                >
                  {status.map((item, index) => (
                    <Cell key={index} fill={colors[index]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        {/* Patient Growth */}

        <Grid item xs={12} md={6}>
          <ChartBox title="Patient Growth">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patients}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#C9A227" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>

        {/* Popular Treatments */}

        <Grid item xs={12} md={6}>
          <ChartBox title="Popular Treatments">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatments} layout="vertical">
                <XAxis type="number" />

                <YAxis dataKey="name" type="category" />

                <Tooltip />

                <Bar dataKey="value" fill="#8B6B1F" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Grid>
      </Grid>
    </Box>
  );
}
