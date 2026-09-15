import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show payment form after clicking Complete Appointment
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paidAmount, setPaidAmount] = useState("");

  // --------------------------------------------------
  // LOAD APPOINTMENT
  // --------------------------------------------------

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://localhost:7166/api/appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data.appointment || response.data;

      setAppointment(data);

      if (data.paymentStatus) {
        setPaymentStatus(data.paymentStatus);
      }

      /*
        IMPORTANT:

        Backend:
        amountPaid = REMAINING amount

        Example:
        totalCost = 19
        amountPaid = 10

        Actual paid = 19 - 10 = 9
      */

      if (data.totalCost !== undefined && data.amountPaid !== undefined) {
        const total = Number(data.totalCost);
        const remaining = Number(data.amountPaid);

        const actualPaid = Math.max(total - remaining, 0);

        setPaidAmount(actualPaid > 0 ? actualPaid.toString() : "");
      }
    } catch (err) {
      console.error(
        "Load appointment error:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message || "Failed to load appointment details.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // DATE / TIME
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return dayjs(date).format("DD/MM/YYYY");
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return dayjs(date).format("HH:mm");
  };

  // --------------------------------------------------
  // PATIENT NAME
  // --------------------------------------------------

  const getPatientName = () => {
    if (!appointment) return "-";

    if (appointment.patientName) {
      return appointment.patientName;
    }

    if (appointment.patient) {
      return (
        `${appointment.patient.firstName || ""} ${
          appointment.patient.lastName || ""
        }`.trim() || "-"
      );
    }

    return "-";
  };

  // --------------------------------------------------
  // TREATMENT NAME
  // --------------------------------------------------

  const getTreatmentName = () => {
    if (!appointment) return "-";

    if (appointment.treatmentName) {
      return appointment.treatmentName;
    }

    if (
      appointment.appointmentTreatments &&
      appointment.appointmentTreatments.length > 0
    ) {
      return (
        appointment.appointmentTreatments[0].treatment?.name ||
        appointment.appointmentTreatments[0].treatmentName ||
        "-"
      );
    }

    return "-";
  };

  // --------------------------------------------------
  // PAYMENT VALUES
  // --------------------------------------------------

  const totalCost = Number(appointment?.totalCost || 0);

  /*
    IMPORTANT:

    Backend stores the REMAINING amount
    inside amountPaid.

    Example:

    DB:
    TotalCost  = 19
    AmountPaid = 10

    Therefore:

    Remaining = 10
    Actual Paid = 19 - 10 = 9
  */

  const remaining = Number(appointment?.amountPaid || 0);

  const amountPaid = Math.max(totalCost - remaining, 0);

  // --------------------------------------------------
  // START COMPLETION
  // --------------------------------------------------

  const handleStartCompletion = () => {
    setError("");
    setSuccess("");

    /*
      Since amountPaid from backend means REMAINING,
      calculate the actual paid amount.
    */

    const total = Number(appointment?.totalCost || 0);

    const currentRemaining = Number(appointment?.amountPaid || 0);

    const currentPaid = Math.max(total - currentRemaining, 0);

    /*
      If appointment is still unpaid,
      start with empty amount.

      Otherwise show the actual paid amount.
    */

    if (appointment?.paymentStatus?.toLowerCase() === "unpaid") {
      setPaidAmount("");
    } else {
      setPaidAmount(currentPaid > 0 ? currentPaid.toString() : "");
    }

    setPaymentStatus(appointment?.paymentStatus || "Unpaid");

    setShowCompletionForm(true);
  };

  // --------------------------------------------------
  // PAYMENT STATUS CHANGE
  // --------------------------------------------------

  const handlePaymentStatusChange = (event) => {
    const value = event.target.value;

    setPaymentStatus(value);

    if (value === "Unpaid") {
      setPaidAmount("");
    }
  };

  // --------------------------------------------------
  // SAVE COMPLETION
  // --------------------------------------------------

  const handleSaveCompletion = async () => {
    setError("");
    setSuccess("");

    let amount = 0;

    if (paymentStatus === "Paid") {
      amount = Number(paidAmount);

      if (paidAmount === "" || Number.isNaN(amount)) {
        setError("Please enter the amount paid.");
        return;
      }

      if (amount <= 0) {
        setError("Paid amount must be greater than 0.");
        return;
      }

      if (amount > totalCost) {
        setError(
          `Paid amount cannot be greater than $${totalCost.toFixed(2)}.`,
        );
        return;
      }
    }

    if (paymentStatus === "Unpaid") {
      amount = 0;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://localhost:7166/api/appointments/${id}/complete`,
        {
          paymentStatus: paymentStatus,
          paidAmount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(
        response.data?.message || "Appointment completed successfully.",
      );

      // Reload saved data from backend
      await loadAppointment();

      setShowCompletionForm(false);
    } catch (err) {
      console.error(
        "Complete appointment error:",
        err.response?.data || err.message,
      );

      setError(
        err.response?.data?.message || "Failed to complete appointment.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#faf8f2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // --------------------------------------------------
  // ERROR / NOT FOUND
  // --------------------------------------------------

  if (!appointment) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#faf8f2",
          p: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: "#6b5b3e",
          }}
        >
          Back
        </Button>

        <Alert severity="error">{error || "Appointment not found."}</Alert>
      </Box>
    );
  }

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const status = appointment.status || "Pending";

  const isPending = status.toLowerCase() === "pending";

  const isCompleted = status.toLowerCase() === "completed";

  const isCancelled = status.toLowerCase() === "cancelled";

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#faf8f2",
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        {/* BACK BUTTON */}

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: "#6b5b3e",
            fontWeight: 600,
          }}
        >
          Back to Appointments
        </Button>

        {/* MAIN CARD */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e5dfd2",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              p: 3,
              background: "#fffdf8",
              borderBottom: "1px solid #e5dfd2",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#3f3528",
              }}
            >
              Appointment Details
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#8a7d6a",
              }}
            >
              View and manage appointment information
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* SUCCESS */}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* ERROR */}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* -------------------------------- */}
            {/* APPOINTMENT INFORMATION */}
            {/* -------------------------------- */}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#4b4032",
                mb: 2,
              }}
            >
              Appointment Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              {/* PATIENT */}

              <InfoBox label="Patient" value={getPatientName()} />

              {/* TREATMENT */}

              <InfoBox label="Treatment" value={getTreatmentName()} />

              {/* CREATED BY */}

              <InfoBox
                label="Created By"
                value={appointment.createdBy || "-"}
              />

              {/* DATE */}

              <InfoBox
                label="Date"
                value={formatDate(appointment.startDateTime)}
              />

              {/* START */}

              <InfoBox
                label="Start Time"
                value={formatTime(appointment.startDateTime)}
              />

              {/* END */}

              <InfoBox
                label="End Time"
                value={formatTime(appointment.endDateTime)}
              />

              {/* STATUS */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "#faf8f2",
                  border: "1px solid #eee7d9",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#8a7d6a",
                    mb: 0.5,
                  }}
                >
                  Status
                </Typography>

                <Chip
                  label={status}
                  icon={isCompleted ? <CheckCircleIcon /> : undefined}
                  sx={{
                    fontWeight: 600,
                    background: isCompleted
                      ? "#f8e8a5"
                      : isCancelled
                        ? "#fee2e2"
                        : "#dbeafe",
                    color: isCompleted
                      ? "#806a00"
                      : isCancelled
                        ? "#b91c1c"
                        : "#1d4ed8",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* -------------------------------- */}
            {/* PAYMENT INFORMATION */}
            {/* -------------------------------- */}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#4b4032",
                mb: 2,
              }}
            >
              Payment Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {/* TOTAL PRICE */}

              <InfoBox label="Total Price" value={`$${totalCost.toFixed(2)}`} />

              {/* ACTUAL PAID */}

              <InfoBox
                label="Amount Paid"
                value={`$${amountPaid.toFixed(2)}`}
              />

              {/* REMAINING */}

              <InfoBox
                label="Remaining"
                value={`$${remaining.toFixed(2)}`}
                highlight
              />
            </Box>

            {/* PAYMENT STATUS */}

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                background: "#faf8f2",
                border: "1px solid #eee7d9",
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#8a7d6a",
                  mb: 0.5,
                }}
              >
                Payment Status
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  color:
                    appointment.paymentStatus?.toLowerCase() === "paid"
                      ? "#15803d"
                      : "#b45309",
                }}
              >
                {appointment.paymentStatus || "Unpaid"}
              </Typography>
            </Box>

            {/* -------------------------------- */}
            {/* COMPLETE BUTTON */}
            {/* -------------------------------- */}

            {isPending && !showCompletionForm && (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleStartCompletion}
                  sx={{
                    background: "#C9A227",
                    color: "#fff",
                    fontWeight: 700,
                    px: 4,
                    py: 1.3,
                    "&:hover": {
                      background: "#b18d20",
                    },
                  }}
                >
                  Complete Appointment
                </Button>
              </Box>
            )}

            {/* -------------------------------- */}
            {/* COMPLETION / PAYMENT FORM */}
            {/* -------------------------------- */}

            {isPending && showCompletionForm && (
              <>
                <Divider sx={{ my: 4 }} />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#4b4032",
                    mb: 2,
                  }}
                >
                  Complete Appointment
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    mb: 3,
                  }}
                >
                  Select whether the patient paid for the appointment.
                </Typography>

                <Box
                  sx={{
                    maxWidth: "450px",
                  }}
                >
                  {/* PAYMENT STATUS */}

                  <TextField
                    select
                    fullWidth
                    label="Payment Status"
                    value={paymentStatus}
                    onChange={handlePaymentStatusChange}
                  >
                    <MenuItem value="Unpaid">Unpaid</MenuItem>

                    <MenuItem value="Paid">Paid</MenuItem>
                  </TextField>

                  {/* PAID AMOUNT */}

                  {paymentStatus === "Paid" && (
                    <TextField
                      fullWidth
                      label="Amount Paid"
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      inputProps={{
                        min: 0,
                        max: totalCost,
                        step: "0.01",
                      }}
                      sx={{ mt: 2 }}
                    />
                  )}

                  {/* LIVE REMAINING */}

                  {paymentStatus === "Paid" &&
                    paidAmount !== "" &&
                    !Number.isNaN(Number(paidAmount)) && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: 2,
                          background: "#faf8f2",
                          border: "1px solid #eee7d9",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#8a7d6a",
                          }}
                        >
                          Remaining
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#4b4032",
                          }}
                        >
                          $
                          {Math.max(totalCost - Number(paidAmount), 0).toFixed(
                            2,
                          )}
                        </Typography>
                      </Box>
                    )}

                  {/* ACTION BUTTONS */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleSaveCompletion}
                      disabled={saving}
                      sx={{
                        background: "#C9A227",
                        color: "#fff",
                        fontWeight: 700,
                        px: 4,
                        "&:hover": {
                          background: "#b18d20",
                        },
                      }}
                    >
                      {saving ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "#fff",
                          }}
                        />
                      ) : (
                        "Save"
                      )}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowCompletionForm(false);
                        setError("");
                      }}
                      disabled={saving}
                      sx={{
                        borderColor: "#cfc5b4",
                        color: "#6b5b3e",
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </>
            )}

            {/* -------------------------------- */}
            {/* COMPLETED MESSAGE */}
            {/* -------------------------------- */}

            {isCompleted && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: 2,
                  background: "#f8f5e8",
                  border: "1px solid #e6d99d",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#806a00",
                  }}
                >
                  Appointment Completed
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#6f654f",
                  }}
                >
                  This appointment has already been completed.
                </Typography>
              </Box>
            )}

            {/* -------------------------------- */}
            {/* CANCELLED MESSAGE */}
            {/* -------------------------------- */}

            {isCancelled && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: 2,
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#b91c1c",
                  }}
                >
                  Appointment Cancelled
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "#7f1d1d",
                  }}
                >
                  This appointment cannot be completed.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

// --------------------------------------------------
// INFORMATION BOX
// --------------------------------------------------

function InfoBox({ label, value, highlight = false }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: "#faf8f2",
        border: "1px solid #eee7d9",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#8a7d6a",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 17,
          fontWeight: 700,
          color: highlight ? "#b45309" : "#40372d",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
