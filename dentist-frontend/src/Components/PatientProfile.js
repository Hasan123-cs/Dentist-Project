import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  MenuItem,
  IconButton,
} from "@mui/material";

import ClinicalSummary from "../Components/ClinicalSummary";

import { useNavigate, useParams } from "react-router-dom";

import { Phone, Person, Payments, CalendarMonth, Edit, Add, Close } from "@mui/icons-material";

import { useState, useEffect } from "react";
import treatmentOptions from "./treatmentOptions";

import DentalChart from "../Components/DentalChart";
import ConditionLegend from "../Components/ConditionLegend";

export default function PatientProfile() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [tab, setTab] = useState(2);
  const [summary, setSummary] = useState({
    balance: 0,
    upcomingAppointments: 0
  });
  const [conditions, setConditions] = useState({});

  const [patient, setPatient] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [completedTreatments, setCompletedTreatments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [treatmentDialog, setTreatmentDialog] = useState(null);
  const [treatmentForm, setTreatmentForm] = useState({});
  const [treatmentError, setTreatmentError] = useState("");
  const [treatmentSaving, setTreatmentSaving] = useState(false);
  const [editHasTooth, setEditHasTooth] = useState(false);
  const [editHasSurface, setEditHasSurface] = useState(false);

  const handleAddPayment = async () => {
    const amount = Number(paymentAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError("Enter a payment amount greater than zero.");
      return;
    }

    setPaymentSaving(true);
    setPaymentError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patients/${id}/treatments/${paymentDialog.medicalRecordId}/payments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to save this payment.");
      }

      setTreatments((current) =>
        current.map((treatment) => {
          if (treatment.medicalRecordId !== paymentDialog.medicalRecordId) {
            return treatment;
          }

          const paid = Number(treatment.paid || 0) + amount;
          const remaining = Math.max(Number(treatment.cost || 0) - paid, 0);
          return {
            ...treatment,
            paid,
            remaining,
            paymentStatus: remaining === 0 ? "Paid" : "Partially Paid",
          };
        }),
      );
      setPaymentDialog(null);
      setPaymentAmount("");

      try {
        const treatmentsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/patients/${id}/treatments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (treatmentsResponse.ok) {
          setTreatments(await treatmentsResponse.json());
        } else {
          console.error("Payment saved, but treatment data refresh failed.");
        }
      } catch (refreshError) {
        console.error("Payment saved, but treatment data refresh failed.", refreshError);
      }
    } catch (err) {
      setPaymentError(err.message || "Unable to save this payment.");
    } finally {
      setPaymentSaving(false);
    }
  };

  const openTreatmentEditor = (treatment) => {
    setTreatmentDialog(treatment);
    setTreatmentError("");
    setEditHasTooth(Boolean(treatment.teeth?.length));
    setEditHasSurface(Boolean(treatment.surfaces?.length));
    setTreatmentForm({
      treatment: treatment.treatment || "",
      treatmentDate: treatment.date || "",
      toothNumbers: (treatment.teeth || []).join(", "),
      surfaces: treatment.surfaces || [],
      status: treatment.status || "NeedsTreatment",
      price: treatment.cost ?? "",
      paidAmount: treatment.paid ?? 0,
      notes: treatment.notes || "",
    });
  };

  const handleUpdateTreatment = async (event) => {
    event.preventDefault();
    setTreatmentError("");

    const rawToothNumbers = treatmentForm.toothNumbers
      .split(",")
      .map((tooth) => tooth.trim())
      .filter(Boolean);
    if (rawToothNumbers.some((tooth) => !/^\d+$/.test(tooth))) {
      setTreatmentError("Enter tooth numbers as comma-separated whole numbers.");
      return;
    }
    if (editHasSurface && rawToothNumbers.length === 0) {
      setTreatmentError("Add a tooth number before selecting a surface.");
      return;
    }

    const toothNumbers = editHasTooth ? rawToothNumbers.map(Number) : [];
    if (
      treatmentForm.treatment === "Bridge" &&
      toothNumbers.length > 0 &&
      toothNumbers.length < 3
    ) {
      setTreatmentError("Bridge requires at least 3 teeth.");
      return;
    }
    const price = treatmentForm.price === "" ? null : Number(treatmentForm.price);
    const paidAmount = Number(treatmentForm.paidAmount);
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      setTreatmentError("Price cannot be negative.");
      return;
    }
    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
      setTreatmentError("Paid amount cannot be negative.");
      return;
    }

    setTreatmentSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = {
        treatment: treatmentForm.treatment.trim(),
        treatmentDate: treatmentForm.treatmentDate,
        toothNumbers,
        surfaces: editHasSurface ? treatmentForm.surfaces : [],
        status: treatmentForm.status,
        price,
        paidAmount,
        notes: treatmentForm.notes.trim() || null,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patients/${id}/treatments/${treatmentDialog.medicalRecordId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to update this treatment.");
      }

      const updated = result.data;
      setTreatments((current) =>
        current.map((item) => {
          if (item.medicalRecordId !== treatmentDialog.medicalRecordId) {
            return item;
          }

          const cost = Number(updated.price);
          const paid = Number(updated.paidAmount);
          const remaining = Math.max(cost - paid, 0);
          return {
            ...item,
            treatment: updated.treatment,
            date: updated.treatmentDate,
            teeth: updated.toothNumbers,
            surfaces: updated.surfaces,
            status: updated.status,
            condition: updated.condition,
            cost,
            paid,
            remaining,
            paymentStatus:
              paid <= 0
                ? "Unpaid"
                : paid >= cost
                  ? "Paid"
                  : "Partially Paid",
            notes: updated.notes,
          };
        }),
      );
      setTreatmentDialog(null);
    } catch (err) {
      setTreatmentError(err.message || "Unable to update this treatment.");
    } finally {
      setTreatmentSaving(false);
    }
  };

  useEffect(() => {
    const getPatient = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/${id}`);

        if (res.ok) {
          const data = await res.json();

          setPatient(data);
        }

        const treatmentRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/patients/${id}/treatments`
        );

        if (treatmentRes.ok) {

          const treatmentData = await treatmentRes.json();

          console.log("TREATMENT API DATA:", treatmentData);

          setTreatments(treatmentData);

        }
        const completedRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/patients/${id}/completed-treatments`
        );


        if (completedRes.ok) {

          const completedData = await completedRes.json();

          setCompletedTreatments(completedData);

        }
        const summaryRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/patients/${id}/summary`
        );

        if (summaryRes.ok) {
          const summaryData = await summaryRes.json();
          setSummary(summaryData);
        }

      } catch (err) {
        console.log(err);
      }
    };
    // load treatment 


    getPatient();
  }, [id]);

  if (!patient) {
    return (
      <Box p={4}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,

        background: "#faf8f2",

        minHeight: "100vh",

        pt: 3,
      }}
    >
      {/* HEADER */}

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },

          borderRadius: 4,

          border: "1px solid #eee3c5",

          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 3 },
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{
                width: { xs: 56, sm: 85 },

                height: { xs: 56, sm: 85 },

                background: "#eef2f7",

                color: "#C9A227",

                fontSize: 28,

                fontWeight: 800,
              }}
            >
              {(patient.firstName + patient.lastName)

                .substring(0, 2)

                .toUpperCase()}
            </Avatar>

            <Box>
              <Typography fontSize={{ xs: 20, sm: 24 }} fontWeight={800} color="#092c57">
                {patient.firstName} {patient.lastName}
              </Typography>

              <Chip
                label="Active Patient"
                sx={{
                  mt: 1,

                  background: "#16a34a",

                  color: "#fff",

                  fontWeight: 700,
                }}
              />

              <Typography mt={1}>Patient ID #{patient.id}</Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2}>


            <Button
              onClick={() => navigate("/patients")}
              sx={{
                color: "#C9A227",

                fontWeight: 700,
              }}
            >
              BACK
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* TABS */}

      <Paper
        sx={{
          borderRadius: 4,

          border: "1px solid #eee3c5",

          mb: 3,
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >

          <Tab label="Overview" />

          <Tab label="Dental Chart" />

          <Tab label="Treatment Plan" />

          <Tab label="Completed Treatments" />

          {/* <Tab label="Images" /> */}

        </Tabs>
      </Paper>

      {/* OVERVIEW */}

      {tab === 0 && (
        <Box>
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",

              margin: 0,
            }}
          >
            <Grid item xs={12} sm={6} md={3}>
              <CardBox>
                <Phone color="warning" />

                <Title>Contact Information</Title>

                <Typography>{patient.phone || "No phone"}</Typography>
              </CardBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CardBox>
                <Person color="warning" />

                <Title>Personal Information</Title>

                <Typography>Gender</Typography>

                <Typography color="text.secondary">{patient.gender}</Typography>

                <Typography mt={1}>Birth Date</Typography>

                <Typography color="text.secondary">
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : "Not available"}
                </Typography>
              </CardBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CardBox>
                <Payments color="warning" />

                <Title>Financial</Title>

                <Typography fontSize={32} fontWeight={800} color="#C9A227">
                  ${summary.balance.toFixed(2)}
                </Typography>

                <Typography>Outstanding Balance</Typography>
              </CardBox>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CardBox>
                <CalendarMonth color="warning" />

                <Title>Appointments</Title>

                <Typography fontSize={32} fontWeight={800} color="#092c57">
                  {summary.upcomingAppointments}
                </Typography>

                <Typography>Upcoming Visits</Typography>
              </CardBox>
            </Grid>
          </Grid>

          {/* MEDICAL NOTES FULL WIDTH */}

          <Paper
            sx={{
              mt: 3,

              p: 3,

              width: "100%",

              borderRadius: 4,

              border: "1px solid #eee3c5",

              boxSizing: "border-box",
            }}
          >
            <Typography
              fontSize={20}
              fontWeight={800}
              color="#092c57"
              textAlign="center"
              mb={2}
            >
              Medical Notes
            </Typography>

            <Box
              sx={{
                background: "#faf8f2",

                borderRadius: 3,

                p: 3,

                minHeight: 100,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "red", fontWeight: 700, fontSize: 24 }}>
                {patient.medicalHistory ||
                  patient.allergies ||
                  "No medical notes available."}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {/* DENTAL CHART */}

      {tab === 1 && (
        <Paper
          sx={{
            mt: 3,

            p: { xs: 2, sm: 3, md: 4 },

            borderRadius: 4,

            border: "1px solid #eee3c5",
          }}
        >
          <Typography fontSize={24} fontWeight={800} color="#C9A227" mb={3}>
            Dental Chart
          </Typography>

          <DentalChart
            patientId={id}
            conditions={conditions}
            setConditions={setConditions}
          />

          <ConditionLegend />

          {/* <ClinicalSummary conditions={conditions} /> */}
        </Paper>
      )}

      {/* TREATMENT PLAN */}

      {tab === 2 && (
        <Paper
          sx={{
            mt: 3,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid #eee3c5",
            minWidth: 0,
          }}
        >

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              mb: 2,
            }}
          >

            <Typography
              fontSize={22}
              fontWeight={800}
              color="#C9A227"
            >
              Treatment Plan
            </Typography>


            <Button
              variant="contained"
              onClick={() =>
                navigate(`/patients/${patient.id}/add-treatment`)
              }
              sx={{
                background: "#C9A227",
                fontWeight: 700,
                borderRadius: 3,
                minHeight: 48,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              + ADD TREATMENT
            </Button>

          </Box>



          <Button
            variant="outlined"
            onClick={() =>
              navigate(
                `/treatments?search=${encodeURIComponent(
                  `${patient.firstName} ${patient.lastName}`
                )}`
              )
            }
            sx={{
              mb: 3,
              mt: 3,
              borderColor: "#C9A227",
              color: "#C9A227",
              fontWeight: 700,
              borderRadius: 3,
              minHeight: 48,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            VIEW ALL TREATMENTS
          </Button>

          {treatments.length > 0 && (
            <Paper
              sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 3,
                background: "#faf8f2",
                border: "1px solid #eee3c5",
                borderRadius: 3,
              }}
            >
              <Typography fontWeight={800} color="#092c57" mb={1}>
                Treatment Plan Balance
              </Typography>
              <Grid container spacing={1}>
                {[
                  ["Total", treatments.reduce((sum, item) => sum + Number(item.cost || 0), 0)],
                  ["Paid", treatments.reduce((sum, item) => sum + Number(item.paid || 0), 0)],
                  ["Outstanding", treatments.reduce((sum, item) => sum + Number(item.remaining || 0), 0)],
                ].map(([label, amount]) => (
                  <Grid item xs={12} sm={4} key={label}>
                    <Typography color="text.secondary">{label}</Typography>
                    <Typography fontWeight={800} color="#C9A227">
                      ${Number(amount).toFixed(2)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}




          {treatments.length === 0 ? (

            <Typography color="#718096">
              No treatments added yet.
            </Typography>

          ) : (

            treatments.map((treatment, index) => (

              <Paper
                key={index}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: 4,
                  background: "#ffffff",
                  border: "1px solid #eee3c5",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >


                {/* HEADER */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2,
                  }}
                >

                  <Box display="flex" alignItems="center" gap={2}>

                    <Avatar
                      sx={{
                        background: "#faf0c8",
                        color: "#C9A227",
                        fontWeight: 800
                      }}
                    >
                      🦷
                    </Avatar>


                    <Box>

                      <Typography
                        fontSize={20}
                        fontWeight={800}
                        color="#092c57"
                      >
                        {treatment.treatment}
                      </Typography>


                      <Typography
                        color="text.secondary"
                        fontSize={14}
                      >
                        Treatment Record
                      </Typography>

                    </Box>

                  </Box>




                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      label={treatment.status}
                      sx={{
                        fontWeight: 700,
                        background:
                          treatment.status === "Completed"
                            ? "#dcfce7"
                            : treatment.status === "InProgress"
                              ? "#fef3c7"
                              : "#e0f2fe",
                        color:
                          treatment.status === "Completed"
                            ? "#166534"
                            : treatment.status === "InProgress"
                              ? "#92400e"
                              : "#0369a1",
                      }}
                    />
                    <Chip
                      label={treatment.paymentStatus || "Unpaid"}
                      color={
                        treatment.paymentStatus === "Paid"
                          ? "success"
                          : treatment.paymentStatus === "Partially Paid"
                            ? "warning"
                            : "default"
                      }
                      variant="outlined"
                    />
                    {treatment.canEdit && (
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => openTreatmentEditor(treatment)}
                        sx={{ color: "#092c57", fontWeight: 700 }}
                      >
                        Edit
                      </Button>
                    )}
                  </Box>

                </Box>





                {/* DATE */}

                <Box
                  sx={{
                    background: "#faf8f2",
                    p: 2,
                    borderRadius: 3,
                    mb: 2
                  }}
                >

                  <Typography fontWeight={700}>
                    📅 Date
                  </Typography>


                  <Typography color="text.secondary">

                    {new Date(treatment.date)
                      .toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        }
                      )}

                  </Typography>

                </Box>






                {/* DETAILS */}

                <Grid container spacing={2}>


                  {/* TEETH */}

                  {
                    treatment.teeth &&
                    treatment.teeth.length > 0 &&

                    <Grid item xs={12} sm={6}>

                      <Box>

                        <Typography fontWeight={700}>
                          🦷 Teeth
                        </Typography>


                        <Typography color="text.secondary">
                          {
                            [...new Set(treatment.teeth)]
                              .join(", ")
                          }
                        </Typography>

                      </Box>

                    </Grid>

                  }





                  {/* SURFACE */}

                  {
                    treatment.surfaces &&
                    treatment.surfaces.length > 0 &&
                    (
                      <Grid item xs={12} sm={6}>

                        <Box>

                          <Typography fontWeight={700}>
                            Surface
                          </Typography>


                          <Typography color="text.secondary">

                            {
                              treatment.surfaces.join(", ")
                            }

                          </Typography>


                        </Box>

                      </Grid>
                    )
                  }




                  {/* CONDITION */}

                  <Grid item xs={12} sm={6}>

                    <Box>

                      <Typography fontWeight={700}>
                        Condition
                      </Typography>


                      <Typography color="text.secondary">
                        {treatment.condition}
                      </Typography>

                    </Box>

                  </Grid>






                  {/* PRICE */}

                  {/* PRICE */}

                  <Grid item xs={12} sm={6}>

                    <Box>

                      <Typography fontWeight={700}>
                        💰 Price
                      </Typography>


                      <Typography
                        color="#C9A227"
                        fontWeight={800}
                      >
                        ${treatment.cost}
                      </Typography>

                    </Box>

                  </Grid>




                  <Grid item xs={12} sm={6}>

                    <Box>

                      <Typography fontWeight={700}>
                        ✅ Paid
                      </Typography>


                      <Typography
                        color="#C9A227"
                        fontWeight={800}
                      >
                        ${treatment.paid}
                      </Typography>

                    </Box>

                  </Grid>
                  <Grid item xs={12} sm={6}>

                    <Box>

                      <Typography fontWeight={700}>
                        ⏳ Remaining
                      </Typography>


                      <Typography
                        color="#C9A227"
                        fontWeight={800}
                      >
                        ${treatment.remaining}
                      </Typography>

                    </Box>

                  </Grid>
                </Grid>

                {Number(treatment.remaining) > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setPaymentDialog(treatment);
                      setPaymentAmount("");
                      setPaymentError("");
                    }}
                    sx={{
                      mt: 2,
                      minHeight: 48,
                      width: { xs: "100%", sm: "auto" },
                      borderColor: "#C9A227",
                      color: "#8a6d1d",
                      fontWeight: 700,
                    }}
                  >
                    Add Payment
                  </Button>
                )}






                {/* NOTES */}

                {
                  treatment.notes &&

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      background: "#f8fafc"
                    }}
                  >

                    <Typography fontWeight={700}>
                      Notes
                    </Typography>


                    <Typography color="text.secondary">
                      {treatment.notes}
                    </Typography>

                  </Box>

                }



              </Paper>

            ))

          )}

        </Paper>
      )}
      {/* COMPLETED TREATMENTS */}

      {
        tab === 3 && (

          <Paper
            sx={{
              mt: 3,
              p: 4,
              borderRadius: 4,
              border: "1px solid #eee3c5"
            }}
          >


            <Typography
              fontSize={24}
              fontWeight={800}
              color="#C9A227"
              mb={3}
            >
              Completed Treatments
            </Typography>



            <Box
              sx={{
                background: "#faf8f2",
                borderRadius: 3,
                p: 3,
                mb: 3
              }}
            >


              <Typography fontWeight={800}>
                Total Cost : $

                {
                  completedTreatments
                    .reduce(
                      (sum, t) =>
                        sum + (t.cost || 0),
                      0
                    )
                }

              </Typography>



              <Typography fontWeight={800}>
                Total Paid : $

                {
                  completedTreatments
                    .reduce(
                      (sum, t) =>
                        sum + (t.paid || 0),
                      0
                    )
                }

              </Typography>



              <Typography fontWeight={800}>
                Total Remaining : $

                {
                  completedTreatments
                    .reduce(
                      (sum, t) =>
                        sum + (t.remaining || 0),
                      0
                    )
                }

              </Typography>


            </Box>





            <Grid container spacing={3}>


              {
                completedTreatments
                  .map((t, index) => (


                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={index}
                    >


                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: "1px solid #eee3c5"
                        }}
                      >



                        <Typography
                          fontSize={20}
                          fontWeight={800}
                          color="#092c57"
                        >
                          🦷 {t.treatment}
                        </Typography>



                        {t.teeth && t.teeth.length > 0 && (
                          <Typography>
                            Teeth: {[...new Set(t.teeth)].join(", ")}
                          </Typography>
                        )}



                        <Typography>
                          Status: {t.status}
                        </Typography>



                        <Typography>
                          💰 Cost: ${t.cost}
                        </Typography>



                        <Typography>
                          ✅ Paid: ${t.paid}
                        </Typography>



                        <Typography>
                          ⏳ Remaining: ${t.remaining}
                        </Typography>



                      </Paper>


                    </Grid>


                  ))

              }


            </Grid>



          </Paper>

        )
      }

      {/* IMAGES */}

      {/* {
        tab === 4 && (
          <Paper
            sx={{
              mt: 3,

              p: 4,

              width: "100%",

              borderRadius: 4,

              border: "1px solid #eee3c5",
            }}
          >
            <Typography
              fontSize={22}
              fontWeight={800}
              color="#C9A227"
              textAlign="center"
            >
              Patient Images
            </Typography>

            <Grid container spacing={3} mt={2}>
              {[
                "Bitewing X-Ray",

                "Panoramic X-Ray",

                "Periapical X-Ray",

                "Dental Scan",
              ].map((image, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    onClick={() => setSelectedImage(image)}
                    sx={{
                      height: 280,

                      borderRadius: 3,

                      overflow: "hidden",

                      border: "1px solid #eee3c5",

                      cursor: "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        height: 210,

                        background: "#111",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        fontSize: 70,

                        color: "#fff",
                      }}
                    >
                      🦷
                    </Box>

                    <Box p={2} textAlign="center">
                      <Typography fontWeight={700}>{image}</Typography>

                      <Chip
                        label="X-RAY"
                        size="small"
                        sx={{
                          mt: 1,

                          background: "#faf0c8",

                          color: "#C9A227",

                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )
      } */}

      {/* FULL SCREEN IMAGE */}
      {/* 
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        fullScreen
      >
        <Box
          onClick={() => setSelectedImage(null)}
          sx={{
            height: "100vh",

            background: "#000",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <Typography fontSize={160} color="#fff">
            🦷
          </Typography>
        </Box>
      </Dialog> */}
      <Dialog
        open={Boolean(treatmentDialog)}
        onClose={() => {
          if (!treatmentSaving) {
            setTreatmentDialog(null);
            setTreatmentError("");
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleUpdateTreatment}>
          <DialogTitle>Edit Treatment</DialogTitle>
          <DialogContent dividers>
            {treatmentError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {treatmentError}
              </Alert>
            )}
            <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
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
                {!treatmentOptions.some(
                  (option) => option.value === treatmentForm.treatment
                ) && (
                  <MenuItem value={treatmentForm.treatment}>
                    {treatmentForm.treatment}
                  </MenuItem>
                )}
              </TextField>
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
              {!editHasTooth ? (
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setEditHasTooth(true)}
                  sx={{ justifySelf: "start", borderColor: "#C9A227", color: "#C9A227" }}
                >
                  Add Tooth Number
                </Button>
              ) : (
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      label={
                        treatmentForm.treatment?.toLowerCase() === "bridge"
                          ? "Tooth Numbers"
                          : "Tooth Number"
                      }
                      value={treatmentForm.toothNumbers || ""}
                      onChange={(event) =>
                        setTreatmentForm((current) => ({
                          ...current,
                          toothNumbers: event.target.value,
                        }))
                      }
                      helperText="Separate multiple tooth numbers with commas."
                      fullWidth
                    />
                    <IconButton
                      type="button"
                      aria-label="Remove tooth numbers"
                      onClick={() => {
                        setEditHasTooth(false);
                        setEditHasSurface(false);
                        setTreatmentForm((current) => ({
                          ...current,
                          toothNumbers: "",
                          surfaces: [],
                        }));
                      }}
                      sx={{ color: "#d32f2f" }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                  {!editHasSurface ? (
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => setEditHasSurface(true)}
                      sx={{ mt: 1.5, borderColor: "#C9A227", color: "#C9A227" }}
                    >
                      Add Surface
                    </Button>
                  ) : (
                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <TextField
                        select
                        label="Surface"
                        value={treatmentForm.surfaces || []}
                        onChange={(event) =>
                          setTreatmentForm((current) => ({
                            ...current,
                            surfaces: event.target.value,
                          }))
                        }
                        SelectProps={{
                          multiple: true,
                          renderValue: (selected) => selected.join(", "),
                        }}
                        helperText="Select the affected tooth surface."
                        fullWidth
                      >
                        <MenuItem value="M">M - Mesial</MenuItem>
                        <MenuItem value="O">O - Occlusal</MenuItem>
                        <MenuItem value="D">D - Distal</MenuItem>
                        <MenuItem value="B">B - Buccal</MenuItem>
                        <MenuItem value="L">L - Lingual</MenuItem>
                      </TextField>
                      <IconButton
                        type="button"
                        aria-label="Remove tooth surfaces"
                        onClick={() => {
                          setEditHasSurface(false);
                          setTreatmentForm((current) => ({
                            ...current,
                            surfaces: [],
                          }));
                        }}
                        sx={{ color: "#d32f2f" }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
              {!editHasTooth && (
                <Typography color="text.secondary" fontSize={14}>
                  Tooth number is optional. Add it only for a tooth-specific treatment.
                </Typography>
              )}
              <TextField
                label="Price"
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
                label="Paid Amount"
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
              <TextField
                label="Notes"
                value={treatmentForm.notes || ""}
                onChange={(event) =>
                  setTreatmentForm((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                multiline
                minRows={2}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setTreatmentDialog(null)}
              disabled={treatmentSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={treatmentSaving}
              sx={{ background: "#C9A227" }}
            >
              {treatmentSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog
        open={Boolean(paymentDialog)}
        onClose={() => {
          if (!paymentSaving) {
            setPaymentDialog(null);
            setPaymentError("");
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add Treatment Payment</DialogTitle>
        <DialogContent>
          {paymentDialog && (
            <Typography color="text.secondary" mb={2}>
              {paymentDialog.treatment} · Remaining balance: $
              {Number(paymentDialog.remaining || 0).toFixed(2)}
            </Typography>
          )}
          {paymentError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {paymentError}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="Payment Amount"
            type="number"
            value={paymentAmount}
            onChange={(event) => setPaymentAmount(event.target.value)}
            inputProps={{
              min: 0,
              step: "0.01",
              inputMode: "decimal",
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1 }}>
          <Button
            fullWidth
            disabled={paymentSaving}
            onClick={() => setPaymentDialog(null)}
            sx={{ minHeight: 48, width: { xs: "100%", sm: "auto" } }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled={paymentSaving || !paymentAmount}
            onClick={handleAddPayment}
            sx={{
              minHeight: 48,
              width: { xs: "100%", sm: "auto" },
              background: "#C9A227",
            }}
          >
            {paymentSaving ? "Saving..." : "Save Payment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}

function CardBox({ children }) {
  return (
    <Paper
      sx={{
        p: 3,

        width: "100%",

        height: 200,

        borderRadius: 4,

        border: "1px solid #eee3c5",

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        alignItems: "center",

        textAlign: "center",

        gap: 1.5,

        boxSizing: "border-box",
      }}
    >
      {children}
    </Paper>
  );
}

function Title({ children }) {
  return (
    <Typography fontWeight={800} fontSize={16} color="#092c57">
      {children}
    </Typography>
  );
}
