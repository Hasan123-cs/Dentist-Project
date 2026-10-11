import { Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "#faf8f2",
      }}
    >
      <Sidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: "calc(100% - 280px)" },
          minWidth: 0,
          p: { xs: 2, sm: 3, lg: 4 },
          boxSizing: "border-box",
          background: "#f7fbff",
        }}
      >
        <Box
          component="header"
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <IconButton
            aria-label="Open navigation menu"
            onClick={() => setMobileNavOpen(true)}
            sx={{ color: "#8a7a55" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography fontSize={18} fontWeight={800} color="#C9A227">
            DentalCare
          </Typography>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
}