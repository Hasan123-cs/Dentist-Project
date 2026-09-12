import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function AddTreatment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    treatment: "",
    tooth: "",
    surface: "",
    status: "Pending",
    price: "",
    notes: "",
  });

  const [showTooth, setShowTooth] = useState(false);
  const [showSurface, setShowSurface] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /*
   * Valid FDI tooth numbers
   */
  const validTeeth = [
    11, 12, 13, 14, 15, 16, 17, 18,

    21, 22, 23, 24, 25, 26, 27, 28,

    31, 32, 33, 34, 35, 36, 37, 38,

    41, 42, 43, 44, 45, 46, 47, 48,
  ];

  /*
   * Detect Bridge only because Bridge can
   * contain multiple teeth.
   *
   * We are NOT using treatment name to decide
   * whether tooth/surface is required.
   */
  const treatmentName = form.treatment.trim().toLowerCase();

  const isBridge = treatmentName.includes("bridge");

  /*
   * Validate tooth number
   */
  const validateTooth = () => {
    /*
     * Tooth is completely optional.
     *
     * If doctor didn't click "Add Tooth",
     * no validation is necessary.
     */
    if (!showTooth) {
      return true;
    }

    if (!form.tooth.trim()) {
      setError("Please enter a tooth number.");
      return false;
    }

    const toothNumbers = form.tooth
      .split(",")
      .map((tooth) => tooth.trim())
      .filter((tooth) => tooth !== "");

    /*
     * Bridge can have multiple teeth.
     */
    if (isBridge) {
      if (toothNumbers.length < 3) {
        setError("Bridge requires at least 3 teeth. Example: 11, 12, 13");
        return false;
      }
    } else {
      /*
       * Normal treatment = exactly one tooth.
       */
      if (toothNumbers.length > 1) {
        setError("Please enter only one tooth number for this treatment.");
        return false;
      }
    }

    /*
     * Validate FDI numbers.
     */
    const invalidTeeth = toothNumbers.filter(
      (tooth) => !validTeeth.includes(Number(tooth)),
    );

    if (invalidTeeth.length > 0) {
      setError(`Invalid tooth number: ${invalidTeeth.join(", ")}`);
      return false;
    }

    return true;
  };

  /*
   * Validate surface
   */
  const validateSurface = () => {
    /*
     * Surface is optional.
     *
     * If doctor didn't click "Add Surface",
     * surface is allowed to be null.
     */
    if (!showSurface) {
      return true;
    }

    /*
     * Surface cannot exist without a tooth.
     */
    if (!showTooth) {
      setError("You must add a tooth number before adding a surface.");
      return false;
    }

    if (!form.surface) {
      setError("Please select a tooth surface.");
      return false;
    }

    return true;
  };

  const handleAddTooth = () => {
    setShowTooth(true);
    setError("");
  };

  const handleRemoveTooth = () => {
    setShowTooth(false);

    /*
     * Removing tooth also removes surface.
     */
    setShowSurface(false);

    setForm((prev) => ({
      ...prev,
      tooth: "",
      surface: "",
    }));

    setError("");
  };

  const handleAddSurface = () => {
    /*
     * Surface requires a tooth.
     */
    if (!showTooth) {
      setError("Please add a tooth number before adding a surface.");
      return;
    }

    setShowSurface(true);
    setError("");
  };

  const handleRemoveSurface = () => {
    setShowSurface(false);

    setForm((prev) => ({
      ...prev,
      surface: "",
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /*
     * Treatment name required.
     */
    if (!form.treatment.trim()) {
      setError("Treatment name is required.");
      return;
    }

    /*
     * Validate tooth if doctor selected it.
     */
    if (!validateTooth()) {
      return;
    }

    /*
     * Validate surface if doctor selected it.
     */
    if (!validateSurface()) {
      return;
    }

    /*
     * Convert tooth input into numbers.
     *
     * If tooth was not added:
     * []
     *
     * If tooth was added:
     * [16]
     *
     * Bridge:
     * [11, 12, 13]
     */
    const toothNumbers = !showTooth
      ? []
      : form.tooth
          .split(",")
          .map((tooth) => Number(tooth.trim()))
          .filter((tooth) => !Number.isNaN(tooth));

    /*
     * Surface:
     *
     * If doctor selected a surface:
     * "O"
     *
     * Otherwise:
     * null
     */
    const surface = showSurface ? form.surface : null;

    /*
     * Final payload
     */
    const treatmentData = {
      patientId: Number(id),
      treatment: form.treatment.trim(),
      toothNumbers: toothNumbers,
      surface: surface,
      status: form.status,
      price: form.price === "" ? null : Number(form.price),
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

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to save treatment.",
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
          {/* =========================
              TREATMENT NAME
          ========================== */}

          <TextField
            label="Treatment Name"
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Example: Cleaning / Filling / Root Canal"
          />

          {/* =========================
              TOOTH NUMBER
          ========================== */}

          {!showTooth ? (
            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddTooth}
              sx={{
                alignSelf: "flex-start",
                borderColor: "#C9A227",
                color: "#C9A227",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Add Tooth Number
            </Button>
          ) : (
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  label={isBridge ? "Tooth Numbers" : "Tooth Number"}
                  name="tooth"
                  value={form.tooth}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  placeholder={isBridge ? "Example: 11, 12, 13" : "Example: 16"}
                  helperText={
                    isBridge
                      ? "Bridge requires at least 3 teeth."
                      : "Enter one FDI tooth number."
                  }
                />

                <IconButton
                  type="button"
                  onClick={handleRemoveTooth}
                  sx={{
                    color: "#d32f2f",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* =========================
                  SURFACE
              ========================== */}

              {!showSurface ? (
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddSurface}
                  sx={{
                    mt: 1.5,
                    borderColor: "#C9A227",
                    color: "#C9A227",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Add Surface
                </Button>
              ) : (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <TextField
                    select
                    label="Surface"
                    name="surface"
                    value={form.surface}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Select the affected tooth surface."
                  >
                    <MenuItem value="M">M - Mesial</MenuItem>

                    <MenuItem value="O">O - Occlusal</MenuItem>

                    <MenuItem value="D">D - Distal</MenuItem>

                    <MenuItem value="B">B - Buccal</MenuItem>

                    <MenuItem value="L">L - Lingual</MenuItem>
                  </TextField>

                  <IconButton
                    type="button"
                    onClick={handleRemoveSurface}
                    sx={{
                      color: "#d32f2f",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}

          {/* =========================
              INFO
          ========================== */}

          {!showTooth && (
            <Typography
              sx={{
                fontSize: 14,
                color: "#718096",
                background: "#f7f9fc",
                p: 1.5,
                borderRadius: 2,
              }}
            >
              Tooth number is optional. Add it only if this treatment is related
              to a specific tooth.
            </Typography>
          )}

          {showTooth && !showSurface && (
            <Typography
              sx={{
                fontSize: 14,
                color: "#718096",
                background: "#f7f9fc",
                p: 1.5,
                borderRadius: 2,
              }}
            >
              No surface selected. This treatment will apply to the whole tooth.
            </Typography>
          )}

          {/* =========================
              STATUS
          ========================== */}

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

          {/* =========================
              PRICE
          ========================== */}

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

          {/* =========================
              NOTES
          ========================== */}

          <TextField
            label="Notes"
            name="notes"
            multiline
            rows={4}
            value={form.notes}
            onChange={handleChange}
            fullWidth
          />

          {/* =========================
              BUTTONS
          ========================== */}

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
