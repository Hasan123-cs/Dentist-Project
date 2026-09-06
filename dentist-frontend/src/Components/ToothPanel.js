import React from "react";

import { Box, Typography, Button } from "@mui/material";

// =====================================================
// TOOTH NUMBERING SYSTEM
// =====================================================

const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

const ALL_UPPER = [...UPPER_RIGHT, ...UPPER_LEFT];
const ALL_LOWER = [...LOWER_RIGHT, ...LOWER_LEFT];

// =====================================================
// BRIDGE VALIDATION HELPERS
// =====================================================

const getArchForTooth = (toothNumber) => {
  if (ALL_UPPER.includes(toothNumber)) return "upper";
  if (ALL_LOWER.includes(toothNumber)) return "lower";
  return null;
};

const areTeethConsecutive = (teeth) => {
  if (teeth.length < 3) return false;

  const sorted = [...teeth].sort((a, b) => a - b);

  // Check if all teeth are in the same arch
  const arch = getArchForTooth(sorted[0]);
  if (!sorted.every((t) => getArchForTooth(t) === arch)) {
    return false;
  }

  // Check if teeth are consecutive (differ by 1)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] !== 1) {
      return false;
    }
  }

  return true;
};

const identifyBridgeTeeth = (teeth) => {
  if (teeth.length < 3) return { abutments: [], pontics: [] };

  const sorted = [...teeth].sort((a, b) => a - b);

  return {
    abutments: [sorted[0], sorted[sorted.length - 1]], // First and last
    pontics: sorted.slice(1, -1), // Middle teeth
  };
};

const conditions = [
  {
    name: "healthy",
    label: "Healthy",
    color: "#e8f7ee",
  },

  {
    name: "filling",
    label: "Filling",
    color: "#42a5f5",
  },

  {
    name: "crown",
    label: "Crown",
    color: "#fdd835",
  },

  {
    name: "missing",
    label: "Missing",
    color: "#bdbdbd",
  },

  {
    name: "implant",
    label: "Implant",
    color: "#8e7dff",
  },

  {
    name: "rootCanal",
    label: "Root Canal",
    color: "#8e24aa",
  },

  {
    name: "bridge",
    label: "Bridge",
    color: "#ffb15c",
  },
];

const surfaces = [
  {
    name: "M",
    label: "Mesial",
  },

  {
    name: "O",
    label: "Occlusal",
  },

  {
    name: "D",
    label: "Distal",
  },

  {
    name: "B",
    label: "Buccal",
  },

  {
    name: "L",
    label: "Lingual",
  },
];

export default function ToothPanel({
  tooth,

  selectedSurface,

  setSelectedSurface,

  setCondition,

  getCondition,

  allConditions = {},
  bridgeMode = false,
  setBridgeMode = () => {},
  bridgeTeeth = [],
  setBridgeTeeth = () => {},
  updateBridgeTeeth = () => {},
}) {
  if (!tooth) return null;

  const currentCondition = selectedSurface
    ? getCondition(tooth, selectedSurface)
    : null;

  // ===================================================
  // Count teeth with any treatment/condition
  // ===================================================

  const countTeethWithTreatment = () => {
    return Object.keys(allConditions).filter((toothNum) => {
      const toothData = allConditions[toothNum];
      // Count if tooth has any condition other than just status
      return Object.keys(toothData).some(
        (key) => key !== "status" && toothData[key],
      );
    }).length;
  };

  const teethWithTreatment = countTeethWithTreatment();

  const handleConditionClick = (condition) => {
    // ===================================================
    // BRIDGE MODE
    // Enter selection mode to pick 3 teeth
    // ===================================================

    if (condition === "bridge") {
      if (!bridgeMode) {
        setBridgeMode(true);
        setBridgeTeeth([tooth]); // Start with current tooth
        alert(
          "✓ Bridge mode activated!\n\nSelect at least 2 more consecutive teeth\n(must be in the same arch)\n\nExample: teeth 13 - 14 - 15 for a 3-unit bridge",
        );
        return;
      }
    }

    if (bridgeMode) {
      return; // Don't allow other treatments in bridge mode
    }

    // Root Canal + Missing do not need surface
    if (condition === "rootCanal" || condition === "missing") {
      setCondition(null, condition);
      setSelectedSurface(null);
      return;
    }

    // Other treatments need surface
    if (!selectedSurface) {
      alert("⚠️ Please select a tooth surface first!");
      return;
    }

    setCondition(selectedSurface, condition);
  };

  return (
    <Box
      sx={{
        mt: 4,

        p: 3,

        border: "1px solid #eee3c5",

        borderRadius: 3,

        background: "#faf8f2",
      }}
    >
      <Typography fontSize={20} fontWeight={800} color="#092c57" mb={2}>
        Selected Tooth: {tooth}
      </Typography>

      {/* ===================================================
          BRIDGE MODE SECTION
      ==================================================== */}

      {bridgeMode && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            background: "#fff3cd",
            border: "2px solid #ffc107",
            borderRadius: 2,
          }}
        >
          <Typography fontWeight={800} fontSize={14} color="#856404" mb={2}>
            🌉 Bridge Mode Active
          </Typography>

          {/* Selected Teeth List */}
          <Box mb={2}>
            <Typography fontSize={12} fontWeight={700} color="#856404" mb={1}>
              Selected Teeth: {bridgeTeeth.sort((a, b) => a - b).join(", ")} (
              {bridgeTeeth.length}/3+)
            </Typography>

            {/* Abutments and Pontics Display */}
            {bridgeTeeth.length >= 3 && (
              <Box sx={{ mt: 1, p: 1, background: "#fffbea", borderRadius: 1 }}>
                {(() => {
                  const { abutments, pontics } =
                    identifyBridgeTeeth(bridgeTeeth);
                  const isValid = areTeethConsecutive(bridgeTeeth);

                  return (
                    <>
                      <Typography fontSize={11} color="#856404" mb={0.5}>
                        <b>Abutments (Supporting):</b> {abutments.join(", ")}
                      </Typography>
                      <Typography fontSize={11} color="#856404">
                        <b>Pontics (Replacements):</b> {pontics.join(", ")}
                      </Typography>

                      {!isValid && (
                        <Typography
                          fontSize={11}
                          color="#d32f2f"
                          fontWeight={700}
                          mt={1}
                        >
                          ⚠️ Teeth must be consecutive and in the same arch!
                        </Typography>
                      )}
                    </>
                  );
                })()}
              </Box>
            )}
          </Box>

          {/* Validation Message */}
          {bridgeTeeth.length < 3 && (
            <Typography fontSize={11} color="#d32f2f" fontWeight={700} mb={2}>
              ❌ A conventional bridge requires at least 3 units: 2 abutments
              and at least 1 pontic.
            </Typography>
          )}

          {bridgeTeeth.length >= 3 && !areTeethConsecutive(bridgeTeeth) && (
            <Typography fontSize={11} color="#d32f2f" fontWeight={700} mb={2}>
              ❌ Selected teeth must be consecutive and in the same arch!
            </Typography>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Button
              onClick={() => {
                if (bridgeTeeth.length < 3) {
                  alert(
                    "❌ A conventional bridge requires at least 3 units: 2 abutments and at least 1 pontic.",
                  );
                  return;
                }

                if (!areTeethConsecutive(bridgeTeeth)) {
                  alert(
                    "❌ Selected teeth must be consecutive and in the same arch!",
                  );
                  return;
                }

                updateBridgeTeeth(bridgeTeeth, null, "bridge");
              }}
              sx={{
                background:
                  bridgeTeeth.length >= 3 && areTeethConsecutive(bridgeTeeth)
                    ? "#28a745"
                    : "#ccc",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 2,
                px: 2,
                py: 1,
                cursor:
                  bridgeTeeth.length >= 3 && areTeethConsecutive(bridgeTeeth)
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              ✓ Apply Bridge
            </Button>

            <Button
              onClick={() => {
                setBridgeMode(false);
                setBridgeTeeth([]);
              }}
              sx={{
                background: "#dc3545",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              ✕ Cancel
            </Button>
          </Box>

          <Typography fontSize={11} color="#856404" fontStyle="italic">
            💡 Click on 3+ consecutive teeth in the chart to form a bridge
            <br />
            Teeth must be in the same arch (upper or lower)
          </Typography>
        </Box>
      )}

      <Typography fontWeight={700} fontSize={13} color="#555" mb={1}>
        Select Surface
      </Typography>

      <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
        {surfaces.map((surface) => (
          <Button
            key={surface.name}
            onClick={() => setSelectedSurface(surface.name)}
            disabled={bridgeMode}
            sx={{
              width: 55,

              height: 40,

              borderRadius: 2,

              fontWeight: 800,

              border: "1px solid #d5d5d5",

              background:
                selectedSurface === surface.name ? "#092c57" : "#ffffff",

              color: selectedSurface === surface.name ? "#ffffff" : "#092c57",
              opacity: bridgeMode ? 0.5 : 1,
            }}
          >
            {surface.name}
          </Button>
        ))}
      </Box>

      {selectedSurface && (
        <Box mb={3}>
          <Typography fontSize={13} color="#718096">
            Selected Surface: <b>{selectedSurface}</b>
          </Typography>

          <Typography fontSize={13} color="#718096" mt={1}>
            Current: <b>{currentCondition || "Healthy"}</b>
          </Typography>
        </Box>
      )}

      {!bridgeMode && (
        <>
          <Typography fontWeight={700} fontSize={13} color="#555" mb={1}>
            Treatment / Condition
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap">
            {conditions.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleConditionClick(item.name)}
                sx={{
                  background: item.color,

                  color: "#092c57",

                  fontWeight: 700,

                  fontSize: 12,

                  borderRadius: 2,

                  px: 2,

                  py: 1,

                  border: "1px solid rgba(0,0,0,.1)",

                  opacity:
                    item.name === "bridge" && teethWithTreatment < 3 ? 0.6 : 1,

                  cursor:
                    item.name === "bridge" && teethWithTreatment < 3
                      ? "not-allowed"
                      : "pointer",

                  "&:hover": {
                    background: item.color,
                    transform:
                      item.name === "bridge" && teethWithTreatment < 3
                        ? "none"
                        : "scale(1.05)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {!selectedSurface && (
            <Typography mt={2} fontSize={12} color="#888">
              Select a tooth surface first (except Root Canal and Missing).
            </Typography>
          )}

          {teethWithTreatment < 3 && (
            <Typography mt={2} fontSize={12} color="#e57373" fontWeight={700}>
              ⚠️ Bridge requires at least 3 teeth with treatments. Currently:{" "}
              {teethWithTreatment}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
