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
} from "@mui/material";

import ClinicalSummary from "../Components/ClinicalSummary";

import { useNavigate, useParams } from "react-router-dom";

import { Phone, Person, Payments, CalendarMonth } from "@mui/icons-material";

import { useState, useEffect } from "react";

import DentalChart from "../Components/DentalChart";
import ConditionLegend from "../Components/ConditionLegend";

export default function PatientProfile() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
const [summary,setSummary] = useState({
  balance:0,
  upcomingAppointments:0
});
  const [conditions, setConditions] = useState({});

  const [patient, setPatient] = useState(null);
const [treatments, setTreatments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getPatient = async () => {
      try {
        const res = await fetch(`https://localhost:7166/api/patients/${id}`);

        if (res.ok) {
          const data = await res.json();

          setPatient(data);
        }

              const treatmentRes = await fetch(
        `https://localhost:7166/api/patients/${id}/treatments`
      );

      if (treatmentRes.ok) {
        const treatmentData = await treatmentRes.json();
        setTreatments(treatmentData);
      }
      const summaryRes = await fetch(
 `https://localhost:7166/api/patients/${id}/summary`
);

if(summaryRes.ok)
{
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

        background: "#faf8f2",

        minHeight: "100vh",

        pt: 3,
      }}
    >
      {/* HEADER */}

      <Paper
        sx={{
          p: 3,

          borderRadius: 4,

          border: "1px solid #eee3c5",

          mb: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={3} alignItems="center">
            <Avatar
              sx={{
                width: 85,

                height: 85,

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
              <Typography fontSize={24} fontWeight={800} color="#092c57">
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
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Overview" />

          <Tab label="Dental Chart" />

          <Tab label="Treatment Plan" />

          <Tab label="Images" />
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
              <Typography>
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

            p: 4,

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

          <ClinicalSummary conditions={conditions} />
        </Paper>
      )}

      {/* TREATMENT PLAN */}

      {tab === 2 && (
        <Paper
          sx={{
            mt: 3,

            p: 4,

            borderRadius: 4,

            border: "1px solid #eee3c5",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={22} fontWeight={800} color="#C9A227">
              Treatment Plan
            </Typography>

            <Button
              variant="contained"
            
              onClick={() => navigate(`/patients/${patient.id}/add-treatment`)}
              sx={{
                background: "#C9A227",
                marginBottom:3,
                fontWeight: 700,

                borderRadius: 3,
              }}
            >
              + ADD TREATMENT
            </Button>
          </Box>
{treatments.length === 0 ? (

  <Typography color="#718096">
    No treatments added yet.
  </Typography>


) : (

  treatments.map((treatment, index) => (

    <Paper
      key={index}
      sx={{
        p:3,
        mb:3,
        borderRadius:4,
        background:"#ffffff",
        border:"1px solid #eee3c5",
        boxShadow:"0 4px 12px rgba(0,0,0,0.05)"
      }}
    >

      {/* HEADER */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >

        <Box display="flex" alignItems="center" gap={2}>

          <Avatar
            sx={{
              background:"#faf0c8",
              color:"#C9A227",
              fontWeight:800
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



        <Chip
          label={treatment.status}
          sx={{
            fontWeight:700,

            background:
              treatment.status === "Completed"
              ? "#dcfce7"
              :
              treatment.status === "InProgress"
              ? "#fef3c7"
              :
              "#e0f2fe",

            color:
              treatment.status === "Completed"
              ? "#166534"
              :
              treatment.status === "InProgress"
              ? "#92400e"
              :
              "#0369a1"
          }}
        />

      </Box>



      {/* DATE */}

      <Box
        sx={{
          background:"#faf8f2",
          p:2,
          borderRadius:3,
          mb:2
        }}
      >

        <Typography
          fontWeight={700}
          color="#092c57"
        >
          📅 Date
        </Typography>


        <Typography color="text.secondary">

          {new Date(treatment.date)
          .toLocaleDateString(
            "en-GB",
            {
              day:"2-digit",
              month:"long",
              year:"numeric"
            }
          )}

        </Typography>

      </Box>



      {/* DETAILS GRID */}

      <Grid container spacing={2}>


        {
          treatment.toothNumber &&

          <Grid item xs={12} sm={6}>

            <Box>
              <Typography fontWeight={700}>
                🦷 Tooth
              </Typography>

              <Typography color="text.secondary">
                {treatment.toothNumber}
              </Typography>
            </Box>

          </Grid>
        }



        {
          treatment.surface &&

          <Grid item xs={12} sm={6}>

            <Box>

              <Typography fontWeight={700}>
                Surface
              </Typography>

              <Typography color="text.secondary">
                {treatment.surface}
              </Typography>

            </Box>

          </Grid>

        }



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



        <Grid item xs={12} sm={6}>

          <Box>

            <Typography fontWeight={700}>
              💰 Price
            </Typography>

            <Typography
              color="#C9A227"
              fontWeight={800}
            >
              ${treatment.price}
            </Typography>

          </Box>

        </Grid>


      </Grid>



      {/* NOTES */}

      {
        treatment.notes &&

        <Box
          sx={{
            mt:2,
            p:2,
            borderRadius:3,
            background:"#f8fafc"
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

      {/* IMAGES */}

      {tab === 3 && (
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
      )}

      {/* FULL SCREEN IMAGE */}

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
      </Dialog>
    </Box>
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
