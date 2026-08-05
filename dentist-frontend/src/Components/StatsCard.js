import { Grid, Paper, Box, Typography } from "@mui/material";

export default function StatCard({ icon, title, value, description }) {
  return (
    <Grid item xs={12} sm={6} xl={3}>
      <Paper
        sx={{
          height: 210,
          p: 3,
          borderRadius: 4,
          border: "1px solid #e3edf7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px rgba(0,0,0,.03)",
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 3,
            background: "#eaf3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0755a0",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography color="#58708b" fontWeight={600} fontSize={15}>
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 38,
              fontWeight: 700,
              color: "#092c57",
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

          <Typography fontSize={14} color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}
