import { Grid, Paper, Box, Typography } from "@mui/material";

export default function StatCard(
  { icon, title, value, description, color = "#C9A227" },
  dashboardData,
) {
  return (
    
    <Grid item xs={12} sm={6} xl={3}>
      <Paper
        elevation={0}
        sx={{
          height: 190,
          p: 3,
          borderRadius: 4,
          border: "1px solid #e3edf7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          transition: "0.3s",

          "&:hover": {
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
            transform: "translateY(-3px)",
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: "#eaf3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          {icon}
        </Box>

        {/* Text */}
        <Box mt={2}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#64748b",
              mb: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 36,
              fontWeight: 200,
              letterSpacing: "-0.5px",
              color: "black",
              lineHeight: 1.1,
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "#94a3b8",
              mt: 1,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}
