import { Paper, Box, Typography, Chip, Button } from "@mui/material";

import {
  MedicalServices,
  AccessTime,
  CalendarMonth,
  AttachMoney,
  ArrowForward,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";

export default function TreatmentCard({ treatment, onDelete }) {
  const navigate = useNavigate();

  // =========================
  // STATUS COLORS
  // =========================

  const statusColor = {
    Completed: "#16a34a",
    "In Progress": "#f59e0b",
    Pending: "#ef4444",
  };

  // =========================
  // FORMAT STATUS
  // =========================

  const statusMap = {
    NeedsTreatment: "Pending",
    InProgress: "In Progress",
    Completed: "Completed",
  };

  const status = statusMap[treatment.status] || treatment.status || "Pending";
  // update status
  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://localhost:7166/api/patients/treatments/${treatment.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newStatus),
        },
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  // ============================
  // DELETE CODE
  // ===========================
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this treatment?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://localhost:7166/api/patients/treatments/${treatment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      onDelete(treatment.id);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT

  // =========================

  const formatTooth = (tooth) => {
    if (tooth === null || tooth === undefined || tooth === "") {
      return "-";
    }

    if (Array.isArray(tooth)) {
      if (tooth.length === 0) {
        return "-";
      }

      return tooth.join(", ");
    }

    return tooth;
  };

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "-";
    }

    if (typeof price === "string" && price.includes("$")) {
      return price;
    }

    return `$${Number(price).toFixed(2)}`;
  };

  // =========================
  // VIEW DETAILS
  // =========================

  const handleViewDetails = () => {
    if (!treatment.patientId) {
      console.error("Patient ID is missing for treatment:", treatment);

      return;
    }

    navigate(`/patients/${treatment.patientId}?tab=treatment`);
  };

  return (
    <Paper
      sx={{
        width: "100%",

        height: "100%",

        minHeight: 420,

        p: 3,

        borderRadius: 4,

        background: "#fff",

        border: "1px solid #eee3c5",

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        boxSizing: "border-box",

        transition: "0.25s",

        "&:hover": {
          transform: "translateY(-4px)",

          boxShadow: "0 10px 25px rgba(0,0,0,.1)",
        },
      }}
    >
      {/* HEADER */}

      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box
            sx={{
              width: 55,

              height: 55,

              borderRadius: "50%",

              background: "#faf7ed",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <MedicalServices
              sx={{
                color: "#C9A227",
              }}
            />
          </Box>

          {/* <Chip
            label={status}
            size="small"
            sx={{
              background: statusColor[status] || "#999",

              color: "#fff",

              fontWeight: 700,
            }}
          /> */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              size="small"
              variant={
                treatment.status?.toLowerCase() === "pending"
                  ? "contained"
                  : "outlined"
              }
              onClick={() => updateStatus("NeedsTreatment")}
              sx={{
                color: status === "Pending" ? "#fff" : "#f59e0b",

                backgroundColor:
                  status === "Pending" ? "#f59e0b" : "transparent",

                borderColor: "#f59e0b",

                "&:hover": {
                  backgroundColor: "#d97706",
                  color: "#fff",
                },
              }}
            >
              Needs Treatment
            </Button>

            <Button
              size="small"
              variant={status === "In Progress" ? "contained" : "outlined"}
              onClick={() => updateStatus("InProgress")}
              sx={{
                color: status === "In Progress" ? "#fff" : "#2563eb",

                backgroundColor:
                  status === "In Progress" ? "#2563eb" : "transparent",

                borderColor: "#2563eb",

                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  color: "#fff",
                },
              }}
            >
              Progress
            </Button>

            <Button
              size="small"
              variant={
                treatment.status?.toLowerCase() === "completed"
                  ? "contained"
                  : "outlined"
              }
              onClick={() => updateStatus("Completed")}
              sx={{
                color:
                  treatment.status?.toLowerCase() === "completed"
                    ? "#fff"
                    : "#16a34a",

                backgroundColor:
                  treatment.status?.toLowerCase() === "completed"
                    ? "#16a34a"
                    : "transparent",

                borderColor: "#16a34a",

                "&:hover": {
                  backgroundColor: "#15803d",
                  color: "#fff",
                },
              }}
            >
              Completed
            </Button>
          </Box>
        </Box>

        <Typography fontSize={19} fontWeight={800} color="#092c57" mt={2}>
          {treatment.patient || "Unknown Patient"}
        </Typography>

        <Typography fontSize={14} color="#718096">
          {treatment.treatment || "-"}
        </Typography>
      </Box>

      {/* DETAILS */}

      <Box mt={2}>
        <Box display="flex" gap={1} alignItems="center" mb={1}>
          <MedicalServices
            fontSize="small"
            sx={{
              color: "#C9A227",
            }}
          />

          <Typography fontSize={14}>
            Tooth: <b>{formatTooth(treatment.tooth)}</b>
          </Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center" mb={1}>
          <CalendarMonth
            fontSize="small"
            sx={{
              color: "#C9A227",
            }}
          />

          <Typography fontSize={14}>{formatDate(treatment.date)}</Typography>
        </Box>
        {/* can add later as feature */}

        {/* <Box display="flex" gap={1} alignItems="center" mb={1}>
          <AccessTime
            fontSize="small"
            sx={{
              color: "#C9A227",
            }}
          />

          <Typography fontSize={14}>
            {treatment.duration ? `${treatment.duration} min` : "-"}
          </Typography>
        </Box> */}

        <Box display="flex" gap={1} alignItems="center">
          <AttachMoney
            fontSize="small"
            sx={{
              color: "#C9A227",
            }}
          />

          <Typography>Total Price: ${treatment.totalPrice}</Typography>

          <Typography
            sx={{
              color: "#d97706",
              fontWeight: 700,
            }}
          >
            Remaining: ${treatment.remainingAmount}
          </Typography>
        </Box>
      </Box>

      {/* NOTES */}

      <Box
        sx={{
          background: "#faf8f2",

          borderRadius: 2,

          p: 1.5,

          mt: 2,

          minHeight: 45,

          display: "flex",

          alignItems: "center",
        }}
      >
        <Typography fontSize={12} color="#718096">
          {treatment.notes || "No notes"}
        </Typography>
      </Box>

      {/* BUTTON */}

      <Button
        fullWidth
        variant="contained"
        endIcon={<ArrowForward />}
        onClick={handleViewDetails}
        sx={{
          mt: 2,

          height: 42,

          background: "#C9A227",

          borderRadius: 3,

          fontWeight: 700,

          "&:hover": {
            background: "#b18c1f",
          },
        }}
      >
        VIEW DETAILS
      </Button>
      <IconButton
        onClick={handleDelete}
        sx={{
          mt: 1,
          color: "#d32f2f",
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
}
