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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import {
  appointmentReminderArabic,
  cleaningReminderArabic,
  appointmentReminderEnglish,
  cleaningReminderEnglish,
  cleaningReminderBoth,
  appointmentReminderBoth
} from "../translate/whatsappMessages";

import {
  WhatsApp
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { PageLoading } from "../Components/PageState";
import { invalidateRequestCache } from "../api/requestCache";
import {
  formatLebanonDateTime,
  getTodayLebanonDate,
} from "../utils/dateTime";
import { createWhatsAppUrl } from "../utils/whatsapp";
import treatmentOptions from "../Components/treatmentOptions";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageLanguage, setMessageLanguage] = useState("en");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show payment form after clicking Complete Appointment
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paidAmount, setPaidAmount] = useState("");
  const [treatmentDialogMode, setTreatmentDialogMode] = useState(null);
  const [patientTreatmentPlans, setPatientTreatmentPlans] = useState([]);
  const [treatmentForm, setTreatmentForm] = useState({});
  const [treatmentDialogError, setTreatmentDialogError] = useState("");
  const [treatmentDialogLoading, setTreatmentDialogLoading] = useState(false);
  const [treatmentDialogSaving, setTreatmentDialogSaving] = useState(false);

  // --------------------------------------------------
  // LOAD APPOINTMENT
  // --------------------------------------------------
  const handleSendWhatsapp = async () => {


    const token = localStorage.getItem("token");


    const phoneResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/patients/${id}/patient-phone`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const patientPhone = phoneResponse.data.phone;
    if (!patientPhone) {

      setError("Patient phone not found");
      return;

    }


    const message =
      messageLanguage === "ar"
        ?
        appointmentReminderArabic(
          getPatientName(),
          formatDate(appointment.startDateTime),
          formatTime(appointment.startDateTime)
        )
        : (messageLanguage === "en" ? appointmentReminderEnglish(
          getPatientName(),
          formatDate(appointment.startDateTime),
          formatTime(appointment.startDateTime)
        ) : appointmentReminderBoth(
          getPatientName(),
          formatDate(appointment.startDateTime),
          formatTime(appointment.startDateTime)
        ));



    const whatsappUrl = createWhatsAppUrl(patientPhone, message);
    if (!whatsappUrl) {
      setError("Patient phone not found");
      return;
    }



    window.open(
      whatsappUrl,
      "_blank"
    );

  };
  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/appointments/${id}`,
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

      if (data.paidAmount !== undefined) {
        const actualPaid = Number(data.paidAmount);
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

    return formatLebanonDateTime(date, "DD/MM/YYYY");
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return formatLebanonDateTime(date, "HH:mm");
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
        `${appointment.patient.firstName || ""} ${appointment.patient.lastName || ""
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

    if (appointment.appointmentType?.toLowerCase() === "checkup") {
      return "Checkup / Consultation";
    }

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
  const amountPaid = Number(appointment?.paidAmount ?? 0);
  const remaining = Number(appointment?.remaining ?? 0);
  const isCheckupAppointment =
    appointment?.appointmentType?.toLowerCase() === "checkup";

  // --------------------------------------------------
  // START COMPLETION
  // --------------------------------------------------

  const handleStartCompletion = () => {
    setError("");
    setSuccess("");

    const outstandingAmount = Number(appointment?.remaining || 0);
    const hasExistingPayment =
      Number(appointment?.paidAmount || 0) > 0 && outstandingAmount > 0;

    setPaymentStatus(hasExistingPayment ? "Paid" : "Unpaid");
    setPaidAmount(
      hasExistingPayment ? outstandingAmount.toFixed(2) : "",
    );

    setShowCompletionForm(true);
  };

  const openCheckupTreatmentDialog = async (mode) => {
    if (!appointment.patientId) {
      setError("A patient record is required to manage treatment plans.");
      return;
    }

    setTreatmentDialogError("");
    setTreatmentDialogMode(mode);

    const appointmentDate = appointment.startDateTime
      ? formatLebanonDateTime(appointment.startDateTime, "YYYY-MM-DD")
      : getTodayLebanonDate();

    if (mode === "add") {
      setTreatmentForm({
        treatment: treatmentOptions[0].value,
        treatmentDate: appointmentDate,
        status: "NeedsTreatment",
        toothNumbers: "",
        surfaces: [],
        price: "",
        paidAmount: "",
      });
      return;
    }

    setTreatmentDialogLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patients/${appointment.patientId}/treatments`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const plans = await response.json();
      if (!response.ok) {
        throw new Error(plans.message || "Unable to load patient treatments.");
      }

      const editablePlans = plans.filter((plan) => plan.canEdit);
      setPatientTreatmentPlans(editablePlans);
      if (editablePlans.length === 0) {
        setTreatmentDialogError("This patient has no editable treatment plans.");
        return;
      }

      const plan = editablePlans[0];
      setTreatmentForm({
        medicalRecordId: plan.medicalRecordId,
        treatment: plan.treatment || "",
        treatmentDate: plan.date || appointmentDate,
        status: plan.status || "NeedsTreatment",
        toothNumbers: (plan.teeth || []).join(", "),
        surfaces: plan.surfaces || [],
        price: plan.cost ?? "",
        paidAmount: plan.paid ?? "",
      });
    } catch (requestError) {
      console.error("Unable to load patient treatment plans:", requestError);
      setTreatmentDialogError(
        requestError.message || "Unable to load patient treatments.",
      );
    } finally {
      setTreatmentDialogLoading(false);
    }
  };

  const handleCheckupTreatmentSave = async (event) => {
    event.preventDefault();
    setTreatmentDialogError("");

    if (!treatmentForm.treatmentDate) {
      setTreatmentDialogError("Select a treatment date.");
      return;
    }

    const toothNumbers = treatmentForm.toothNumbers
      .split(",")
      .map((tooth) => tooth.trim())
      .filter(Boolean);
    if (toothNumbers.some((tooth) => !/^\d+$/.test(tooth))) {
      setTreatmentDialogError("Enter tooth numbers separated by commas.");
      return;
    }
    if (
      treatmentForm.treatment.toLowerCase() === "bridge" &&
      toothNumbers.length < 3
    ) {
      setTreatmentDialogError("Bridge requires at least 3 tooth numbers.");
      return;
    }
    if (
      treatmentForm.treatment.toLowerCase() !== "bridge" &&
      toothNumbers.length > 1
    ) {
      setTreatmentDialogError("Enter only one tooth for this treatment.");
      return;
    }
    if (treatmentForm.surfaces.length > 0 && toothNumbers.length === 0) {
      setTreatmentDialogError("A surface requires a tooth number.");
      return;
    }

    const price =
      treatmentForm.price === "" ? null : Number(treatmentForm.price);
    const paidAmount =
      treatmentForm.paidAmount === ""
        ? treatmentDialogMode === "edit"
          ? null
          : 0
        : Number(treatmentForm.paidAmount);
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setTreatmentDialogError("Price cannot be negative.");
      return;
    }
    if (paidAmount !== null && (!Number.isFinite(paidAmount) || paidAmount < 0)) {
      setTreatmentDialogError("Paid amount cannot be negative.");
      return;
    }

    const payload = {
      treatment: treatmentForm.treatment,
      treatmentDate: treatmentForm.treatmentDate,
      toothNumbers: toothNumbers.map(Number),
      surfaces: treatmentForm.surfaces,
      status: treatmentForm.status,
      price,
      paidAmount,
    };

    setTreatmentDialogSaving(true);
    try {
      const token = localStorage.getItem("token");
      const isEditing = treatmentDialogMode === "edit";
      const url = `${process.env.REACT_APP_API_URL}/api/patients/${appointment.patientId}/treatments${
        isEditing ? `/${treatmentForm.medicalRecordId}` : ""
      }`;
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responseText = await response.text();
      let result = {};
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          if (!response.ok) {
            throw new Error(responseText);
          }
          throw new Error("The treatment save response was not valid JSON.");
        }
      }
      if (!response.ok) {
        throw new Error(
          result.message ||
            result.Message ||
            result.error ||
            result.title ||
            result.detail ||
            "Unable to save this treatment.",
        );
      }

      invalidateRequestCache("/api/patients");
      setTreatmentDialogMode(null);
      setSuccess(
        isEditing
          ? "Treatment plan updated successfully."
          : "Treatment added to the patient plan.",
      );
    } catch (requestError) {
      console.error("Unable to save checkup treatment:", requestError);
      setTreatmentDialogError(
        requestError.message || "Unable to save this treatment.",
      );
    } finally {
      setTreatmentDialogSaving(false);
    }
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

    if (!isCheckupAppointment && paymentStatus !== "Unpaid") {
      amount = Number(paidAmount);

      if (paidAmount === "" || Number.isNaN(amount)) {
        setError("Please enter the amount paid.");
        return;
      }

      if (amount <= 0) {
        setError("Paid amount must be greater than 0.");
        return;
      }

    }

    if (isCheckupAppointment || paymentStatus === "Unpaid") {
      amount = 0;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/appointments/${id}/complete`,
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
      invalidateRequestCache("/api/patients");

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
  // CANCEL APPOINTMENT
  // --------------------------------------------------

  const handleCancelAppointment = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(
        response.data?.message || "Appointment cancelled successfully.",
      );

      // Reload appointment from backend
      await loadAppointment();

      // Close completion form if it was open
      setShowCompletionForm(false);
    } catch (err) {
      console.error(
        "Cancel appointment error:",
        err.response?.data || err.message,
      );

      setError(err.response?.data?.message || "Failed to cancel appointment.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return <PageLoading label="Loading appointment..." />;
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
                  icon={
                    isCompleted ? (
                      <CheckCircleIcon />
                    ) : isCancelled ? (
                      <CancelIcon />
                    ) : undefined
                  }
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
                {appointment.paymentStatus === "PartiallyPaid"
                  ? "Partially Paid"
                  : appointment.paymentStatus || "Unpaid"}
              </Typography>
            </Box>

            {/* -------------------------------- */}
            {/* PENDING ACTION BUTTONS */}
            {/* -------------------------------- */}

            {isPending && !showCompletionForm && (
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* COMPLETE APPOINTMENT */}

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleStartCompletion}
                  disabled={saving}
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

                {/* CANCEL APPOINTMENT */}

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelAppointment}
                  disabled={saving}
                  sx={{
                    borderColor: "#dc2626",
                    color: "#dc2626",
                    fontWeight: 700,
                    px: 4,
                    py: 1.3,

                    "&:hover": {
                      borderColor: "#b91c1c",
                      background: "#fef2f2",
                    },
                  }}
                >
                  Cancel Appointment
                </Button>
              </Box>
            )}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >


              <Button
                variant="outlined"
                onClick={() => setMessageLanguage("ar")}
                sx={{
                  background:
                    messageLanguage === "ar"
                      ?
                      "#C9A227"
                      :
                      "transparent",
                  color:
                    messageLanguage === "ar"
                      ?
                      "#fff"
                      :
                      "#333"
                }}
              >
                العربية
              </Button>



              <Button
                variant="outlined"
                onClick={() => setMessageLanguage("en")}
                sx={{
                  background:
                    messageLanguage === "en"
                      ?
                      "#092c57"
                      :
                      "transparent",
                  color:
                    messageLanguage === "en"
                      ?
                      "#fff"
                      :
                      "#333"
                }}
              >
                English
              </Button>

              <Button
                variant="outlined"
                onClick={() => setMessageLanguage("both")}
                sx={{
                  background:
                    messageLanguage === "both"
                      ? "#C9A227"
                      : "transparent",

                  color:
                    messageLanguage === "both"
                      ? "#fff"
                      : "#333",

                  borderColor: "#C9A227",

                  "&:hover": {
                    background:
                      messageLanguage === "both"
                        ? "#b18d20"
                        : "#faf8f2",
                  },
                }}
              >
                Both
              </Button>

              <Button
                variant="contained"
                startIcon={<WhatsApp />}
                onClick={handleSendWhatsapp}
                sx={{
                  background: "#25D366",
                  fontWeight: 700,

                  "&:hover": {
                    background: "#1da851"
                  }
                }}
              >
                Send WhatsApp
              </Button>


            </Box>
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
                  {isCheckupAppointment
                    ? "Update the patient's treatment plan if needed, then complete the checkup."
                    : "Select whether the patient paid for the appointment."}
                </Typography>

                <Box
                  sx={{
                    maxWidth: "450px",
                  }}
                >
                  {isCheckupAppointment ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => openCheckupTreatmentDialog("edit")}
                        disabled={!appointment.patientId || treatmentDialogLoading}
                        sx={{ borderColor: "#C9A227", color: "#8a6d1d" }}
                      >
                        Edit Treatment
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => openCheckupTreatmentDialog("add")}
                        disabled={!appointment.patientId}
                        sx={{ borderColor: "#C9A227", color: "#8a6d1d" }}
                      >
                        Add New Treatment
                      </Button>
                      {!appointment.patientId && (
                        <Typography color="text.secondary" sx={{ width: "100%" }}>
                          A saved patient record is required to manage a treatment plan.
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <>
                      <TextField
                        select
                        fullWidth
                        label="Payment Status"
                        value={paymentStatus}
                        onChange={handlePaymentStatusChange}
                      >
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="PartiallyPaid">Partially Paid</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                      </TextField>

                      {paymentStatus !== "Unpaid" && (
                        <TextField
                          fullWidth
                          label="Amount Paid"
                          type="number"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          inputProps={{ min: 0, step: "0.01" }}
                          sx={{ mt: 2 }}
                        />
                      )}

                      {paymentStatus !== "Unpaid" &&
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
                          {Math.max(remaining - Number(paidAmount), 0).toFixed(
                            2,
                          )}
                        </Typography>
                      </Box>
                        )}
                    </>
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
        <Dialog
          open={Boolean(treatmentDialogMode)}
          onClose={() => {
            if (!treatmentDialogSaving) {
              setTreatmentDialogMode(null);
              setTreatmentDialogError("");
            }
          }}
          fullWidth
          maxWidth="sm"
        >
          <Box component="form" onSubmit={handleCheckupTreatmentSave}>
            <DialogTitle>
              {treatmentDialogMode === "edit"
                ? "Edit Patient Treatment"
                : "Add New Treatment"}
            </DialogTitle>
            <DialogContent dividers>
              {treatmentDialogError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {treatmentDialogError}
                </Alert>
              )}
              {treatmentDialogLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
                  {treatmentDialogMode === "edit" && (
                    <TextField
                      select
                      label="Patient Treatment Plan"
                      value={treatmentForm.medicalRecordId || ""}
                      onChange={(event) => {
                        const plan = patientTreatmentPlans.find(
                          (item) =>
                            String(item.medicalRecordId) ===
                            String(event.target.value),
                        );
                        if (!plan) return;
                        setTreatmentForm({
                          medicalRecordId: plan.medicalRecordId,
                          treatment: plan.treatment || "",
                          treatmentDate: plan.date || "",
                          status: plan.status || "NeedsTreatment",
                          toothNumbers: (plan.teeth || []).join(", "),
                          surfaces: plan.surfaces || [],
                          price: plan.cost ?? "",
                          paidAmount: plan.paid ?? "",
                        });
                      }}
                      fullWidth
                    >
                      {patientTreatmentPlans.map((plan) => (
                        <MenuItem
                          key={plan.medicalRecordId}
                          value={plan.medicalRecordId}
                        >
                          {plan.treatment} · {plan.date}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  {treatmentDialogMode === "add" && (
                  <TextField
                    select
                    label="Treatment"
                    value={treatmentForm.treatment || ""}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        treatment: event.target.value,
                      }))
                    }
                    required
                    fullWidth
                  >
                    {treatmentOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  )}
                  <TextField
                    label="Treatment Date"
                    type="date"
                    value={treatmentForm.treatmentDate || ""}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        treatmentDate: event.target.value,
                      }))
                    }
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                  />
                  <TextField
                    select
                    label="Status"
                    value={treatmentForm.status || "NeedsTreatment"}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        status: event.target.value,
                      }))
                    }
                    fullWidth
                  >
                    <MenuItem value="NeedsTreatment">Needs Treatment</MenuItem>
                    <MenuItem value="InProgress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </TextField>
                  <TextField
                    label={
                      treatmentForm.treatment?.toLowerCase() === "bridge"
                        ? "Tooth Numbers (optional)"
                        : "Tooth Number (optional)"
                    }
                    value={treatmentForm.toothNumbers || ""}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        toothNumbers: event.target.value,
                        surfaces: event.target.value.trim()
                          ? current.surfaces
                          : [],
                      }))
                    }
                    helperText="Separate multiple tooth numbers with commas."
                    fullWidth
                  />
                  <TextField
                    select
                    label="Surfaces (optional)"
                    value={treatmentForm.surfaces || []}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        surfaces: Array.from(
                          new Set(
                            Array.isArray(event.target.value)
                              ? event.target.value
                              : event.target.value.split(","),
                          ),
                        ),
                      }))
                    }
                    slotProps={{
                      select: {
                        multiple: true,
                        renderValue: (selected) => selected.join(", "),
                      },
                    }}
                    disabled={!treatmentForm.toothNumbers?.trim()}
                    fullWidth
                  >
                    {[
                      ["M", "Mesial"],
                      ["O", "Occlusal"],
                      ["D", "Distal"],
                      ["B", "Buccal"],
                      ["L", "Lingual"],
                    ].map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        <Checkbox
                          checked={(treatmentForm.surfaces || []).includes(value)}
                        />
                        {value} - {label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Price (optional)"
                    type="number"
                    value={treatmentForm.price ?? ""}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        price: event.target.value,
                      }))
                    }
                    inputProps={{ min: 0, step: "0.01" }}
                    fullWidth
                  />
                  <TextField
                    label="Paid Amount (optional)"
                    type="number"
                    value={treatmentForm.paidAmount ?? ""}
                    onChange={(event) =>
                      setTreatmentForm((current) => ({
                        ...current,
                        paidAmount: event.target.value,
                      }))
                    }
                    inputProps={{ min: 0, step: "0.01" }}
                    fullWidth
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setTreatmentDialogMode(null)}
                disabled={treatmentDialogSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  treatmentDialogLoading ||
                  treatmentDialogSaving ||
                  (treatmentDialogMode === "edit" &&
                    !treatmentForm.medicalRecordId)
                }
                sx={{ background: "#C9A227" }}
              >
                {treatmentDialogSaving ? "Saving..." : "Save Treatment"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
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
