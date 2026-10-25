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

const getLocalDateInputValue = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export default function AddTreatment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    treatment: "Bridge",
    treatmentDate: getLocalDateInputValue(),
    tooth: "",
    surface: [],
    status: "Pending",
    price: "",
    paidAmount: "0",
    notes: "",
  });

  const [showTooth, setShowTooth] = useState(false);
  const [showSurface, setShowSurface] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;

    console.log("VALUE:", value);

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
  };
  const treatmentsRequireTooth = [
    "filling",
    "root canal",
    "crown",
    "implant",
    "missing",
    "fracture",
    "bridge",
    "cavity",
  ];

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

  const requiresTooth = treatmentsRequireTooth.includes(treatmentName);

  const isToothMissing = requiresTooth && form.tooth.trim() === "";

  const canSubmit =
    form.treatment.trim() !== "" &&
    form.treatmentDate !== "" &&
    !isToothMissing &&
    (!showSurface || form.surface.length > 0) &&
    Number(form.paidAmount || 0) >= 0 &&
    (form.price === "" ||
      Number(form.paidAmount || 0) <= Number(form.price)) &&
    !loading;
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

    if (form.surface.length === 0) {
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
      surface: [],
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
      surface: [],
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (
      Number(form.paidAmount || 0) < 0 ||
      (form.price !== "" &&
        Number(form.paidAmount || 0) > Number(form.price))
    ) {
      setError("Paid amount cannot exceed the treatment price.");
      return;
    }

    if (form.treatment === "Extraction") {
      form.treatment = "missing";
    }
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
    const surface = showSurface ? form.surface : [];

    /*
     * Final payload
     */
    const treatmentData = {

      patientId: Number(id),

      treatment: form.treatment.trim(),

      treatmentDate: form.treatmentDate,

      toothNumbers: toothNumbers,

      surfaces: surface,

      status: form.status,

      price: form.price === "" ? null : Number(form.price),

      paidAmount: Number(form.paidAmount || 0),

      notes: form.notes.trim() === "" ? null : form.notes.trim(),

    };
    console.log("Sending treatment:", treatmentData);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/patients/${id}/treatments`,
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
        p: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Paper
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: { xs: 2, sm: 3, md: 4 },
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
          {/* 
          <TextField
            label="Treatment Name"
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            fullWidth
            required
            placeholder="Example: Cleaning / Filling / Root Canal"
          /> */}
          <select name="treatment"
            id="n"
            value={form.treatment}
            onChange={handleChange}
            style={{
              width: "100%",
              maxWidth: "100%",
              minHeight: "48px",
              padding: "8px 12px",
              mt: 3,
              fontSize: "15px",
              color: "#333",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              outline: "none",
              cursor: "pointer",
            }} >
            <option value="Veneers">Veneers</option>

            <option value="Bridge">Bridge </option>

            <option value="Filling">Filling </option>
            <option value="Gouttiere">Gouttiere</option>
            <option value="Laser">Laser</option>
            <option value="Root canal">Root canal
            </option>
            <option value="Extraction">Extraction</option>
            <option value="Crown">Crown</option>
            <option value="Implant">Implant</option>

            <option value="Pulpotomie">Pulpotomie</option>
            <option value="Pulpectomie">Pulpectomie</option>
            <option value="Cpp">Cpp</option>
            <option value="cleaning">Scaling</option>
          </select>

          <TextField
            label="Treatment Date"
            name="treatmentDate"
            type="date"
            value={form.treatmentDate}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
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
                    slotProps={{
                      select: {
                        multiple: true,
                        renderValue: (selected) => selected.join(", "),
                      },
                    }}
                  >
                    <MenuItem value="M">
                      M - Mesial
                    </MenuItem>

                    <MenuItem value="O">
                      O - Occlusal
                    </MenuItem>

                    <MenuItem value="D">
                      D - Distal
                    </MenuItem>

                    <MenuItem value="B">
                      B - Buccal
                    </MenuItem>

                    <MenuItem value="L">
                      L - Lingual
                    </MenuItem>

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

          <TextField
            label="Paid Now"
            name="paidAmount"
            type="number"
            value={form.paidAmount}
            onChange={handleChange}
            inputProps={{ min: 0, step: "0.01" }}
            helperText="Must not be greater than the treatment price."
            fullWidth
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

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: "flex-end",
              gap: 1.5,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              disabled={loading}
              onClick={() => navigate(`/patients/${id}?tab=treatment`)}
              sx={{
                borderColor: "#C9A227",
                color: "#C9A227",
                minHeight: 48,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit}
              sx={{
                background: "#C9A227",
                fontWeight: 700,
                minHeight: 48,
                width: { xs: "100%", sm: "auto" },

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
