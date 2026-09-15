import { Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const colors = {
  pending: {
    bg: "#dbeafe",
    border: "#2563eb",
  },
  completed: {
    bg: "#f8e8a5",
    border: "#C9A227",
  },
  cancelled: {
    bg: "#fee2e2",
    border: "#dc2626",
  },
};

export default function AppointmentCard({ appointment, onDragStart }) {
  const navigate = useNavigate();

  const statusKey =
    appointment.status?.toLowerCase() === "completed"
      ? "completed"
      : appointment.status?.toLowerCase() === "cancelled"
        ? "cancelled"
        : "pending";

  const style = colors[statusKey];

  const startTime = dayjs(appointment.startDateTime).format("HH:mm");

  const endTime = dayjs(appointment.endDateTime).format("HH:mm");

  const duration =
    dayjs(appointment.endDateTime).diff(
      dayjs(appointment.startDateTime),
      "minute",
    ) || 30;

  const isShort = duration <= 30;
  const isMedium = duration <= 60;

  const handleDetails = () => {
    navigate(`/appointmentDetails/${appointment.id}`);
  };

  return (
    <Box
      draggable
      onDragStart={() => onDragStart(appointment)}
      sx={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: "6px",
        px: isShort ? 0.7 : 1,
        py: isShort ? 0.5 : 0.8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      {/* PATIENT NAME */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: isShort ? "11px" : "13px",
          color: "#3f3528",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {appointment.patientName || "No Name"}
      </Typography>

      {/* TIME */}
      <Typography
        sx={{
          fontSize: isShort ? "10px" : "11px",
          color: "#5f5548",
          lineHeight: 1.2,
        }}
      >
        {startTime} - {endTime}
      </Typography>

      {/* DETAILS BUTTON */}
      <Button
        variant="contained"
        size="small"
        onClick={(e) => {
          // Prevent the button click from interfering
          // with dragging the appointment card.
          e.stopPropagation();
          handleDetails();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        sx={{
          minHeight: isShort ? "20px" : "24px",
          height: isShort ? "20px" : "24px",
          minWidth: 0,
          px: isShort ? 0.5 : 1,
          py: 0,
          mt: 0.5,
          fontSize: isShort ? "9px" : isMedium ? "10px" : "11px",
          fontWeight: 700,
          textTransform: "none",
          backgroundColor: "#6b5b3e",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#55472f",
          },
        }}
      >
        Details
      </Button>
    </Box>
  );
}
