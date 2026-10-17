import { Paper, Box, Typography, Button, IconButton } from "@mui/material";

import { ChevronLeft, ChevronRight, CalendarMonth } from "@mui/icons-material";

export default function CalendarToolbar({
  currentDate,
  setCurrentDate,
  view,
  setView,
}) {
  const startOfWeek = currentDate.startOf("week").add(1, "day");

  const endOfWeek = startOfWeek.add(6, "day");

  return (
    <Paper
      sx={{
        mt: 3,

        p: { xs: 1.5, sm: 2 },

        borderRadius: 4,

        border: "1px solid #eee3c5",

        background: "#fff",
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
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            justifyContent: { xs: "space-between", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <CalendarMonth
            sx={{
              color: "#C9A227",
            }}
          />

          <Typography
            fontWeight={700}
            color="#3d2f12"
            sx={{ fontSize: { xs: 13, sm: 16 }, textAlign: "center" }}
          >
            Calendar View
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ xs: "center", sm: "flex-start" }}
          width={{ xs: "100%", sm: "auto" }}
          gap={{ xs: 0.5, sm: 2 }}
        >
          <IconButton
            onClick={() => {
              setCurrentDate(currentDate.subtract(1, "week"));
            }}
            sx={{
              border: "1px solid #eee3c5",
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Typography
            fontWeight={700}
            color="#3d2f12"
            sx={{ fontSize: { xs: 12, sm: 16 }, whiteSpace: "nowrap" }}
          >
            {startOfWeek.format("MMM D")}

            {" - "}

            {endOfWeek.format("MMM D, YYYY")}
          </Typography>

          <IconButton
            onClick={() => {
              setCurrentDate(currentDate.add(1, "week"));
            }}
            sx={{
              border: "1px solid #eee3c5",
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-start" },
          }}
        >
          <Button
            onClick={() => setView("day")}
            fullWidth
            sx={{
              minHeight: 44,
              color: view === "day" ? "#fff" : "#8a7a55",

              background: view === "day" ? "#C9A227" : "transparent",

              fontWeight: 700,
            }}
          >
            Day
          </Button>

          <Button
            onClick={() => setView("3days")}
            fullWidth
            sx={{
              minHeight: 44,
              color: view === "3days" ? "#fff" : "#8a7a55",

              background: view === "3days" ? "#C9A227" : "transparent",

              fontWeight: 700,
            }}
          >
            3 Days
          </Button>

          <Button
            onClick={() => setView("week")}
            fullWidth
            sx={{
              minHeight: 44,
              color: view === "week" ? "#fff" : "#8a7a55",

              background: view === "week" ? "#C9A227" : "transparent",

              fontWeight: 700,

              "&:hover": {
                background: "#b18c1f",
              },
            }}
          >
            Week
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
