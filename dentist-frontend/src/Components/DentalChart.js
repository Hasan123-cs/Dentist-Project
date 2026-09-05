import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Tooth from "./Tooth";
import ToothPanel from "./ToothPanel";

// =====================================================
// C# ENUM VALUES
// =====================================================

// ToothSurface
// M = 0
// O = 1
// D = 2
// B = 3
// L = 4

const SURFACE_ENUM = {
  0: "M",
  1: "O",
  2: "D",
  3: "B",
  4: "L",
};

// ToothCondition
// Cavity = 0
// Filling = 1
// RootCanal = 2
// Missing = 3
// Crown = 4
// Fracture = 5

const CONDITION_ENUM = {
  0: "cavity",
  1: "filling",
  2: "rootCanal",
  3: "missing",
  4: "crown",
  5: "fracture",
};

// ToothStatus
// Healthy = 0
// NeedsTreatment = 1
// InProgress = 2
// Completed = 3
// Extracted = 4

const STATUS_ENUM = {
  0: "Healthy",
  1: "NeedsTreatment",
  2: "InProgress",
  3: "Completed",
  4: "Extracted",
};

export default function DentalChart({ patientId, conditions, setConditions }) {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedSurface, setSelectedSurface] = useState(null);

  // =====================================================
  // FDI TOOTH NUMBERING
  // =====================================================

  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];

  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  // =====================================================
  // GET CONDITION FROM BACKEND
  // Handles BOTH:
  // condition: 2
  // condition: "RootCanal"
  // =====================================================

  const conditionFromBackend = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    // Backend sends enum as number
    if (typeof value === "number") {
      return CONDITION_ENUM[value] || null;
    }

    // Backend may send enum as string
    if (typeof value === "string") {
      const normalized = value.trim();

      if (!normalized) {
        return null;
      }

      // Example: "RootCanal" -> "rootCanal"
      return normalized.charAt(0).toLowerCase() + normalized.slice(1);
    }

    return null;
  };

  // =====================================================
  // GET SURFACE FROM BACKEND
  // Handles BOTH:
  // surface: 1
  // surface: "O"
  // =====================================================

  const surfaceFromBackend = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number") {
      return SURFACE_ENUM[value] || null;
    }

    if (typeof value === "string") {
      return value;
    }

    return null;
  };

  // =====================================================
  // GET STATUS FROM BACKEND
  // Handles BOTH:
  // status: 1
  // status: "NeedsTreatment"
  // =====================================================

  const statusFromBackend = (value) => {
    if (value === null || value === undefined) {
      return "NeedsTreatment";
    }

    if (typeof value === "number") {
      return STATUS_ENUM[value] || "NeedsTreatment";
    }

    if (typeof value === "string") {
      return value;
    }

    return "NeedsTreatment";
  };

  // =====================================================
  // LOAD DENTAL CHART
  // PATIENT-WIDE
  // =====================================================

  useEffect(() => {
    if (!patientId) {
      setConditions({});
      return;
    }

    const fetchDentalChart = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://localhost:7166/api/DentalChart/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Dental chart from backend:", response.data);

        const chartData = {};

        response.data.forEach((item) => {
          const toothNumber = item.toothNumber;

          if (!chartData[toothNumber]) {
            chartData[toothNumber] = {};
          }

          // =================================================
          // CONDITION
          // =================================================

          const condition = conditionFromBackend(item.condition);

          // =================================================
          // STATUS
          // =================================================

          const status = statusFromBackend(item.status);

          // =================================================
          // SURFACE
          // =================================================

          const surface = surfaceFromBackend(item.surface);

          console.log("Converted item:", {
            toothNumber,
            surface,
            condition,
            status,
          });

          // =================================================
          // WHOLE TOOTH
          //
          // surface == null
          //
          // Example:
          // RootCanal
          // Missing
          // =================================================

          if (!surface) {
            if (condition === "rootCanal") {
              chartData[toothNumber].rootCanal = "Root Canal";
            }

            if (condition === "missing") {
              chartData[toothNumber].missing = "Missing";
            }

            // Store status too
            chartData[toothNumber].status = status;

            return;
          }

          // =================================================
          // SURFACE CONDITION
          //
          // Example:
          // O -> filling
          // M -> cavity
          // =================================================

          chartData[toothNumber][surface] = condition;

          // Save status
          chartData[toothNumber].status = status;
        });

        console.log("Formatted dental chart:", chartData);

        setConditions(chartData);
      } catch (error) {
        console.error("Error fetching dental chart:", error);

        if (error.response) {
          console.error("Backend status:", error.response.status);

          console.error("Backend response:", error.response.data);
        }
      }
    };

    fetchDentalChart();
  }, [patientId, setConditions]);

  // =====================================================
  // UPDATE TOOTH IN BACKEND
  //
  // IMPORTANT:
  // NO appointmentId
  // because your new DTO doesn't contain appointmentId.
  // =====================================================

  const updateToothStatus = async (
    toothNumber,
    surface,
    condition,
    status = "NeedsTreatment",
  ) => {
    if (!patientId || !toothNumber || !condition) {
      console.error("Missing data:", {
        patientId,
        toothNumber,
        surface,
        condition,
        status,
      });

      return;
    }

    // =====================================================
    // Convert frontend condition to C# enum string
    // =====================================================

    const conditionMap = {
      cavity: "Cavity",
      filling: "Filling",
      rootCanal: "RootCanal",
      missing: "Missing",
      crown: "Crown",
      fracture: "Fracture",
    };

    const backendCondition = conditionMap[condition] || condition;

    // =====================================================
    // Surface
    //
    // frontend:
    // M / O / D / B / L
    //
    // backend DTO accepts string
    // =====================================================

    const backendSurface = surface || null;

    // =====================================================
    // SEND DATA
    // =====================================================

    const toothData = {
      patientId: Number(patientId),
      toothNumber: Number(toothNumber),
      surface: backendSurface,
      condition: backendCondition,
      status: status,
      treatmentId: null,
      notes: null,
    };

    console.log("Sending tooth update:", toothData);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "https://localhost:7166/api/DentalChart/tooth",
        toothData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Tooth updated successfully:", response.data);

      // =====================================================
      // UPDATE UI IMMEDIATELY
      // =====================================================

      setConditions((prev) => {
        const currentTooth = prev[toothNumber] || {};

        // ===================================================
        // ROOT CANAL
        // ===================================================

        if (condition === "rootCanal") {
          return {
            ...prev,
            [toothNumber]: {
              ...currentTooth,
              rootCanal: "Root Canal",
              status: status,
            },
          };
        }

        // ===================================================
        // MISSING
        // ===================================================

        if (condition === "missing") {
          return {
            ...prev,
            [toothNumber]: {
              ...currentTooth,
              missing: "Missing",
              status: status,
            },
          };
        }

        // ===================================================
        // SURFACE CONDITION
        // ===================================================

        if (!surface) {
          return prev;
        }

        return {
          ...prev,
          [toothNumber]: {
            ...currentTooth,
            [surface]: condition,
            status: status,
          },
        };
      });
    } catch (error) {
      console.error("Error updating tooth:", error);

      if (error.response) {
        console.error("Backend status:", error.response.status);

        console.error("Backend response:", error.response.data);
      }
    }
  };

  // =====================================================
  // CONDITION SELECTED FROM TOOTH PANEL
  // =====================================================

  const updateCondition = (surface, value) => {
    if (!selectedTooth) {
      console.error("No tooth selected.");
      return;
    }

    console.log("Updating condition:", {
      tooth: selectedTooth,
      surface,
      value,
    });

    // =====================================================
    // WHOLE TOOTH
    // =====================================================

    if (value === "rootCanal" || value === "missing") {
      updateToothStatus(selectedTooth, null, value, "NeedsTreatment");

      setSelectedSurface(null);

      return;
    }

    // =====================================================
    // SURFACE CONDITION
    // =====================================================

    if (!surface) {
      console.error("No surface selected.");
      return;
    }

    updateToothStatus(selectedTooth, surface, value, "NeedsTreatment");
  };

  // =====================================================
  // RENDER TEETH
  // =====================================================

  const renderTeeth = (list, isUpper) => {
    return list.map((number) => (
      <Tooth
        key={number}
        number={number}
        isUpper={isUpper}
        selected={selectedTooth === number}
        conditions={conditions?.[number] || {}}
        onClick={() => {
          console.log("Selected tooth:", number);

          setSelectedTooth(number);
          setSelectedSurface(null);
        }}
        onSurfaceClick={(surface) => {
          console.log("Selected tooth:", number, "surface:", surface);

          setSelectedTooth(number);
          setSelectedSurface(surface);
        }}
      />
    ));
  };

  // =====================================================
  // TOOTH ROW
  // =====================================================

  const ToothRow = ({ right, left, isUpper }) => {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: 1,
          py: 2,
        }}
      >
        {/* RIGHT SIDE */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {renderTeeth(right, isUpper)}
        </Box>

        {/* MID LINE */}

        <Box
          sx={{
            height: 150,
            width: "2px",
            background: "#ddd",
            mx: 1,
            flexShrink: 0,
          }}
        />

        {/* LEFT SIDE */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          {renderTeeth(left, isUpper)}
        </Box>
      </Box>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        background: "#fff",
        borderRadius: 3,
        p: 3,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* TITLE */}

      <Typography
        textAlign="center"
        fontSize={22}
        fontWeight={800}
        color="#092c57"
      >
        Dental Chart
      </Typography>

      <Typography textAlign="center" fontSize={13} color="#718096" mb={3}>
        Clinical Odontogram
        <br />
        Patient Dental Chart
      </Typography>

      {/* =================================================
          UPPER TEETH
      ================================================= */}

      <Typography textAlign="center" fontWeight={800} color="#092c57" mb={2}>
        MAXILLARY (UPPER)
      </Typography>

      <ToothRow right={upperRight} left={upperLeft} isUpper={true} />

      {/* DIVIDER */}

      <Box
        sx={{
          borderTop: "1px solid #ddd",
          my: 4,
        }}
      />

      {/* =================================================
          LOWER TEETH
      ================================================= */}

      <Typography textAlign="center" fontWeight={800} color="#092c57" mb={2}>
        MANDIBULAR (LOWER)
      </Typography>

      <ToothRow right={lowerRight} left={lowerLeft} isUpper={false} />

      {/* =================================================
          TOOTH PANEL
      ================================================= */}

      <ToothPanel
        tooth={selectedTooth}
        selectedSurface={selectedSurface}
        setSelectedSurface={setSelectedSurface}
        setCondition={updateCondition}
        getCondition={(tooth, surface) => {
          return conditions?.[tooth]?.[surface];
        }}
      />
    </Box>
  );
}
