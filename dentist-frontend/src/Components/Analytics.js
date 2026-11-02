import { Box, Paper, Typography } from "@mui/material";
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
import { EmptyState } from "./PageState";

const colors = ["#D4AF37", "#B8860B", "#996515", "#7A5200"];

function ChartBox({ title, data, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: { xs: 350, sm: 420 },
        p: { xs: 2, sm: 3 },
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid #eee3c5",
        background: "#fff",
      }}
    >
      <Typography fontSize={18} fontWeight={700} color="#3d2f12" mb={2}>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: { xs: 280, sm: 340 } }}>
        {data.length === 0 ? (
          <EmptyState
            title={`No ${title.toLowerCase()} data`}
            description="Data will appear here when available."
            sx={{ minHeight: 0, height: "100%", border: 0, p: 2 }}
          />
        ) : (
          children
        )}
      </Box>
    </Paper>
  );
}

export default function Analytics({ analysisList = {} }) {
  const revenue = Array.isArray(analysisList.revenue) ? analysisList.revenue : [];
  const status = Array.isArray(analysisList.status) ? analysisList.status : [];
  const patients = Array.isArray(analysisList.patients) ? analysisList.patients : [];
  const treatments = Array.isArray(analysisList.treatments) ? analysisList.treatments : [];

  return (
    <Box mt={6} sx={{ width: "100%", minWidth: 0 }}>
      <Typography fontSize={{ xs: 21, sm: 24 }} fontWeight={800} color="#3d2f12" mb={3}>
        Practice Analytics
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", minWidth: 0 }}>
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <ChartBox title="Revenue Trend" data={revenue}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#C9A227" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </Box>

        <Box sx={{ width: "100%", minWidth: 0 }}>
          <ChartBox title="Appointment Status" data={status}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={status}
                  dataKey="value"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={5}
                >
                  {status.map((item, index) => (
                    <Cell key={item.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Box>

        <Box sx={{ width: "100%", minWidth: 0 }}>
          <ChartBox title="Patient Growth" data={patients}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patients}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#C9A227" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Box>

        <Box sx={{ width: "100%", minWidth: 0 }}>
          <ChartBox title="Popular Treatments" data={treatments}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatments} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B6B1F" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Box>
      </Box>
    </Box>
  );
}
