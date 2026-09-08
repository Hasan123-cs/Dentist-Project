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
  6: "implant",
  7: "bridge",
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
  const [bridgeMode, setBridgeMode] = useState(false);
  const [bridgeTeeth, setBridgeTeeth] = useState([]);

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
            if (condition === "bridge") {
              chartData[toothNumber].bridge = "Bridge";
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
  // UPDATE MULTIPLE TEETH FOR BRIDGE
  // Sends all teeth in bridge together
  // =====================================================

  const updateBridgeTeeth = async (toothNumbers) => {
    if (!patientId || toothNumbers.length < 3) {
      alert("❌ Bridge requires at least 3 teeth!");
      return;
    }

    // Sort teeth
    const sorted = [...toothNumbers].sort((a, b) => a - b);

    // Identify bridge structure
    const abutments = [sorted[0], sorted[sorted.length - 1]];
    const pontics = sorted.slice(1, -1);

    // Confirmation
    const bridgeStructure = `
🌉 BRIDGE CONFIRMATION

Bridge Type: ${sorted.length}-unit bridge

Teeth: ${sorted.join(" - ")}

Abutments:
• ${abutments.join(", ")}

Pontics:
• ${pontics.join(", ")}

Proceed?
  `;

    if (!window.confirm(bridgeStructure)) {
      return;
    }

    // ============================================
    // CREATE LIST FOR BACKEND
    // ============================================

    const bridgeData = sorted.map((toothNum) => ({
      patientId: Number(patientId),
      toothNumber: Number(toothNum),
      surface: null,
      condition: "Bridge",
      status: "Completed",
      treatmentId: null,
      notes: null,
    }));

    console.log("Sending bridge update:", bridgeData);

    try {
      const token = localStorage.getItem("token");

      // ============================================
      // ONE API REQUEST
      // ============================================

      const response = await axios.put(
        "https://localhost:7166/api/DentalChart/bridge",
        bridgeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Bridge updated successfully:", response.data);

      alert(`✓ Bridge saved successfully for teeth ${sorted.join(", ")}`);

      // ============================================
      // REFETCH DENTAL CHART
      // ============================================

      const refetchResponse = await axios.get(
        `https://localhost:7166/api/DentalChart/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const chartData = {};

      refetchResponse.data.forEach((item) => {
        const toothNumber = item.toothNumber;

        if (!chartData[toothNumber]) {
          chartData[toothNumber] = {};
        }

        const condition = conditionFromBackend(item.condition);
        const status = statusFromBackend(item.status);
        const surface = surfaceFromBackend(item.surface);

        // Whole tooth condition
        if (!surface) {
          if (condition === "rootCanal") {
            chartData[toothNumber].rootCanal = "Root Canal";
          }

          if (condition === "missing") {
            chartData[toothNumber].missing = "Missing";
          }

          if (condition === "bridge") {
            chartData[toothNumber].bridge = "Bridge";
          }

          chartData[toothNumber].status = status;

          return;
        }

        // Surface condition
        chartData[toothNumber][surface] = condition;
        chartData[toothNumber].status = status;
      });

      console.log("Updated dental chart:", chartData);

      setConditions(chartData);

      // ============================================
      // EXIT BRIDGE MODE
      // ============================================

      setBridgeMode(false);
      setBridgeTeeth([]);
      setSelectedTooth(null);
      setSelectedSurface(null);
    } catch (error) {
      console.error("Error updating bridge:", error);

      if (error.response) {
        console.error("Backend status:", error.response.status);
        console.error("Backend response:", error.response.data);

        alert(error.response.data?.message || "❌ Failed to save bridge.");
      } else {
        alert("❌ Failed to connect to the server.");
      }
    }
  };
  // =====================================================
  // clear a tooth from backend
  // =====================================================

  // const clearTooth = async (toothNumber) => {
  //   if (!patientId || !toothNumber) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     const resp = await axios.delete(
  //       `http://localhost:7166/api/DentalChart/tooth/${patientId}/${toothNumber}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     console.log(resp.data.message);

  //     // Remove the tooth from the current UI immediately
  //     setConditions((prev) => {
  //       const updated = { ...prev };
  //       delete updated[toothNumber];
  //       return updated;
  //     });

  //     setSelectedTooth(null);
  //     setSelectedSurface(null);

  //     console.log(`Tooth ${toothNumber} cleared successfully.`);
  //   } catch (error) {
  //     console.error("Error clearing tooth:", error);
  //   }
  // };

  const clearTooth = async (toothNumber) => {
    console.log("========== CLEAR TOOTH START ==========");
    console.log("Patient ID:", patientId);
    console.log("Tooth Number:", toothNumber);

    if (!patientId || !toothNumber) {
      console.log("❌ Missing patientId or toothNumber");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      console.log("Token exists:", !!token);
      console.log(
        "Token preview:",
        token ? `${token.substring(0, 20)}...` : "NO TOKEN",
      );

      const url = `https://localhost:7166/api/DentalChart/tooth/${patientId}/${toothNumber}`;

      console.log("DELETE URL:", url);
      console.log("Sending DELETE request...");

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ DELETE SUCCESS");
      console.log("Status:", response.status);
      console.log("Response:", response.data);

      setConditions((prev) => {
        const updated = { ...prev };
        delete updated[toothNumber];
        return updated;
      });

      setSelectedTooth(null);
      setSelectedSurface(null);

      console.log("✅ UI updated");
      console.log("========== CLEAR TOOTH END ==========");
    } catch (error) {
      console.log("========== CLEAR TOOTH ERROR ==========");

      console.log("❌ Full error:", error);
      console.log("Error message:", error.message);
      console.log("Error code:", error.code);
      console.log("Error response:", error.response);
      console.log("Error response status:", error.response?.status);
      console.log("Error response data:", error.response?.data);
      console.log("Error request:", error.request);
      console.log("Request URL:", error.config?.url);
      console.log("Request method:", error.config?.method);
      console.log("Request headers:", error.config?.headers);

      console.log("========== END ERROR ==========");
    }
  };

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
      implant: "Implant",
      bridge: "Bridge",
      healthy: "Healthy",
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
      // REFETCH UPDATED DATA FROM BACKEND
      // Ensures UI matches backend state exactly
      // =====================================================

      try {
        const token = localStorage.getItem("token");

        const refetchResponse = await axios.get(
          `https://localhost:7166/api/DentalChart/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Refetched dental chart:", refetchResponse.data);

        const chartData = {};

        refetchResponse.data.forEach((item) => {
          const tNumber = item.toothNumber;

          if (!chartData[tNumber]) {
            chartData[tNumber] = {};
          }

          const cond = conditionFromBackend(item.condition);
          const stat = statusFromBackend(item.status);
          const surf = surfaceFromBackend(item.surface);

          if (!surf) {
            if (cond === "rootCanal") {
              chartData[tNumber].rootCanal = "Root Canal";
            }

            if (cond === "missing") {
              chartData[tNumber].missing = "Missing";
            }

            if (cond === "bridge") {
              chartData[tNumber].bridge = "Bridge";
            }

            chartData[tNumber].status = stat;
            return;
          }

          chartData[tNumber][surf] = cond;
          chartData[tNumber].status = stat;
        });

        console.log("UI Updated with backend data:", chartData);
        setConditions(chartData);
      } catch (refetchError) {
        console.error("Error refetching dental chart:", refetchError);

        // Fallback: Update UI with local state
        setConditions((prev) => {
          const currentTooth = prev[toothNumber] || {};

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
      }
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
        bridgeSelected={bridgeTeeth.includes(number)}
        bridgeMode={bridgeMode}
        conditions={conditions?.[number] || {}}
        status={conditions?.[number]?.status}
        onClick={() => {
          console.log("Selected tooth:", number);

          // ===================================================
          // BRIDGE MODE
          // Add/remove tooth from bridge selection
          // ===================================================

          if (bridgeMode) {
            setBridgeTeeth((prev) => {
              if (prev.includes(number)) {
                return prev.filter((t) => t !== number);
              } else {
                return [...prev, number];
              }
            });
            return;
          }

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
        onClearTooth={clearTooth}
        getCondition={(tooth, surface) => {
          return conditions?.[tooth]?.[surface];
        }}
        allConditions={conditions}
        bridgeMode={bridgeMode}
        setBridgeMode={setBridgeMode}
        bridgeTeeth={bridgeTeeth}
        setBridgeTeeth={setBridgeTeeth}
        updateBridgeTeeth={updateBridgeTeeth}
      />
    </Box>
  );
}
