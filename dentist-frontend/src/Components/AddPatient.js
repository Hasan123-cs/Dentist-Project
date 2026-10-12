import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    birthDate: "",
    notes: "",
  });
  const [notesss, setNotesss] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not authenticated.");
        return;
      }
      console.log(form.notes)
      console.log(form.notesss)
      form.notes = form.notes + " " + notesss;
      console.log(form.notes)

      const response = await fetch("https://localhost:7166/api/Patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create patient.");
      }

      console.log("Patient created:", data);

      navigate("/patients");
    } catch (error) {
      console.error("Error creating patient:", error);
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "100vh",

        background: "#faf8f2",

        p: 4,
      }}
    >
      <Paper
        sx={{
          maxWidth: 700,

          mx: "auto",

          p: 4,

          borderRadius: 4,

          background: "#fff",

          border: "1px solid #eee3c5",
        }}
      >
        <Typography
          fontSize={28}
          fontWeight={800}
          color="#092c57"
          mb={4}
          textAlign="center"
        >
          Add New Patient
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",

            flexDirection: "column",

            gap: 2.5,
          }}
        >

          {/* === this for id patient === */}
          <TextField
            label="Full Name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            type="number"
            required
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Male">Male</MenuItem>

            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          {/* DATE OF BIRTH */}

          <TextField
            placeholder="Date of Birth"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            type="date"
            InputLabelProps={{
              shrink: false,
            }}
            fullWidth
            sx={{
              "& input": {
                fontSize: 16,
              },
            }}
          />

          <TextField
            label="Medical Notes"
            name="notesss"
            value={notesss}
            onChange={(e) => { setNotesss(e.target.value) }}
            multiline
            rows={4}
            fullWidth
          />

          <select name="notes"
            value={form.notes}
            onChange={handleChange}
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "8px 12px",
              fontSize: "15px",
              color: "#333",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              outline: "none",
              cursor: "pointer",
            }} >
            <option value="Hypertension">Hypertension </option>
            <option value="Diabetes">Diabetes </option>
            <option value="Allergie a penicillin">Allergie a penicillin</option>
            <option value="Allergie">Allergie</option>
            <option value="Heart disease">Heart disease
            </option>
            <option value="Bleeding discorders">Bleeding discorders</option>
            <option value="Asthma">Asthma</option>
            <option value="Kidney disease">Kidney disease</option>
            <option value="Liver disease">Liver disease</option>
            <option value="Thyroid disease">Thyroid disease</option>
            <option value="Epilepsy">Epilepsy</option>
            <option value="Pregnant">Pregnant</option>
            <option value="Anticoagulants medicament">Anticoagulants medicament</option>
            <option value="Previous endocarditis / prosthetic">Previous endocarditis / prosthetic</option>
            <option value="heart valve">heart valve</option>
          </select>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/patients")}
              sx={{
                borderColor: "#C9A227",

                color: "#C9A227",

                fontWeight: 700,

                borderRadius: 3,

                px: 3,
              }}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "#C9A227",

                color: "#fff",

                fontWeight: 700,

                borderRadius: 3,

                px: 3,

                "&:hover": {
                  background: "#b18c1f",
                },
              }}
            >
              SAVE PATIENT
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
