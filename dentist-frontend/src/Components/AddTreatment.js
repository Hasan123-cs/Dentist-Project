import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import { useState } from "react";

export default function AddTreatment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    treatment: "",
    tooth: "",
    status: "Pending",
    price: "",
    duration: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setError("");
  };

  const treatmentName = form.treatment.trim().toLowerCase();

  const isCleaning = treatmentName.includes("cleaning");

  const isLaser =
    treatmentName.includes("laser") ||
    treatmentName.includes("whitening") ||
    treatmentName.includes("تبييض");

  const isBridge = treatmentName.includes("bridge");

  // Cleaning and Laser don't need a tooth
  const toothNotRequired = isCleaning || isLaser;

  const validateTooth = () => {
    if (toothNotRequired) {
      return true;
    }

    const toothNumbers = form.tooth
      .split(",")
      .map((tooth) => tooth.trim())
      .filter((tooth) => tooth !== "");

    if (isBridge) {
      if (toothNumbers.length < 3) {
        setError("Bridge requires at least 3 teeth. Example: 11, 12, 13");

        return false;
      }
    } else {
      if (toothNumbers.length < 1) {
        setError("Tooth number is required.");

        return false;
      }

      if (toothNumbers.length > 1) {
        setError("Please enter only one tooth number for this treatment.");

        return false;
      }
    }

    const validTeeth = [
      11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32,
      33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
    ];

    const invalidTeeth = toothNumbers.filter(
      (tooth) => !validTeeth.includes(Number(tooth)),
    );

    if (invalidTeeth.length > 0) {
      setError(`Invalid tooth number: ${invalidTeeth.join(", ")}`);

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Treatment required
    if (!form.treatment.trim()) {
      setError("Treatment name is required.");

      return;
    }

    if (!validateTooth()) {
      return;
    }

    const toothNumbers = toothNotRequired
      ? []
      : form.tooth
          .split(",")
          .map((tooth) => Number(tooth.trim()))
          .filter((tooth) => !Number.isNaN(tooth));

    const treatmentData = {
      patientId: Number(id),

      treatment: form.treatment.trim(),

      toothNumbers: toothNumbers,

      status: form.status,

      price: form.price === "" ? null : Number(form.price),

      duration: form.duration.trim() === "" ? null : form.duration.trim(),

      notes: form.notes.trim() === "" ? null : form.notes.trim(),
    };

    console.log("Sending treatment:", treatmentData);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://localhost:7166/api/patients/${id}/treatments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(treatmentData),
        },
      );

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      // Backend returned an error
      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to save treatment.",
        );
      }

      console.log("Treatment saved successfully:", data);

      navigate(`/patients/${id}?tab=treatment`);
    } catch (err) {
      console.error("Error saving treatment:", err);

      setError(err.message || "Something went wrong while saving treatment.");
    } finally {
      setLoading(false);
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
          border: "1px solid #eee3c5",
          background: "#fff",
        }}
      >
        <Typography fontSize={28} fontWeight={800} color="#092c57" mb={1}>
          Add Treatment
        </Typography>

        <Typography color="#718096" mb={3}>
          Patient ID #{id}
        </Typography>

        {error && (
          <Typography
            color="error"
            mb={2}
            sx={{
              background: "#fff1f1",
              padding: 1.5,
              borderRadius: 2,
            }}
          >
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Treatment Name"
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            fullWidth
            required
          />

          {!toothNotRequired && (
            <TextField
              label={isBridge ? "Tooth Numbers" : "Tooth Number"}
              name="tooth"
              value={form.tooth}
              onChange={handleChange}
              fullWidth
              placeholder={isBridge ? "Example: 11, 12, 13" : "Example: 16"}
              helperText={
                isBridge
                  ? "Bridge requires at least 3 teeth. Separate teeth with commas."
                  : "Enter one tooth number."
              }
            />
          )}

          {isCleaning && (
            <Typography
              sx={{
                fontSize: 14,
                color: "#718096",
                background: "#f7f9fc",
                p: 1.5,
                borderRadius: 2,
              }}
            >
              Cleaning does not require a tooth number.
            </Typography>
          )}

          {isLaser && (
            <Typography
              sx={{
                fontSize: 14,
                color: "#718096",
                background: "#f7f9fc",
                p: 1.5,
                borderRadius: 2,
              }}
            >
              Laser / Whitening does not require a tooth number.
            </Typography>
          )}

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>

            <MenuItem value="In Progress">In Progress</MenuItem>

            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <TextField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            inputProps={{
              min: 0,
              step: "0.01",
            }}
          />

          <TextField
            label="Duration"
            name="duration"
            placeholder="Example: 60 min"
            value={form.duration}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Notes"
            name="notes"
            multiline
            rows={4}
            value={form.notes}
            onChange={handleChange}
            fullWidth
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => navigate(`/patients/${id}?tab=treatment`)}
              sx={{
                borderColor: "#C9A227",
                color: "#C9A227",
              }}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "#C9A227",
                fontWeight: 700,

                "&:hover": {
                  background: "#b18c1f",
                },
              }}
            >
              {loading ? "SAVING..." : "SAVE TREATMENT"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
