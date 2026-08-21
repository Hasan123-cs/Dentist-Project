import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

const colors = {
  scheduled: { bg: "#dbeafe", border: "#2563eb" },
  confirmed: { bg: "#dcfce7", border: "#16a34a" },
  completed: { bg: "#f8e8a5", border: "#C9A227" },
  cancelled: { bg: "#fee2e2", border: "#dc2626" },
};

export default function AppointmentCard({ appointment, onDragStart }) {
  const statusKey = appointment.status?.toLowerCase();
  const style = colors[statusKey] || colors.scheduled;

  const startVal = appointment.startDateTime;
  const endVal = appointment.endDateTime;

  return (
    <Box
      draggable
      onDragStart={() => onDragStart(appointment)}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 65,
        background: style.bg,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: 1.5,
        p: 0.75,
        cursor: "grab",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,.15)",
        },
      }}
    >
      {/* 1. Patient Name */}
      <Typography
        fontSize={11}
        fontWeight={700}
        color="#1e293b"
        lineHeight={1.2}
        noWrap
      >
        {appointment.patientName || "No Name"}
      </Typography>

      {/* 3. Time Display */}
      <Typography
        fontSize={10}
        fontWeight={600}
        color="#3b82f6"
        lineHeight={1.1}
        noWrap
      >
        {dayjs(startVal).format("HH:mm")} - {dayjs(endVal).format("HH:mm")}
      </Typography>

      {/* 4. Status */}
      <Typography
        fontSize={9.5}
        fontWeight={600}
        lineHeight={1}
        noWrap
        sx={{
          textTransform: "capitalize",
          color: style.border,
        }}
      >
        {appointment.status || "Scheduled"}
      </Typography>
    </Box>
  );
}
