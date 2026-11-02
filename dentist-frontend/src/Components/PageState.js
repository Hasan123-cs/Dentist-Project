import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import InboxOutlined from "@mui/icons-material/InboxOutlined";

export function PageLoading({ label = "Loading..." }) {
  return (
    <Box
      role="status"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        minHeight: "100vh",
        background: "#f7fbff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        color: "#092c57",
      }}
    >
      <CircularProgress aria-label={label} />
      <Typography fontWeight={600}>{label}</Typography>
    </Box>
  );
}

export function EmptyState({
  title = "Nothing to show",
  description,
  icon: Icon = InboxOutlined,
  sx,
}) {
  return (
    <Paper
      role="status"
      variant="outlined"
      sx={{
        minHeight: 180,
        p: { xs: 3, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        textAlign: "center",
        borderStyle: "dashed",
        borderColor: "#d7dce3",
        color: "#718096",
        ...sx,
      }}
    >
      <Icon sx={{ fontSize: 40, color: "#9aa7b5" }} />
      <Typography fontWeight={700} color="#092c57">
        {title}
      </Typography>
      {description && <Typography variant="body2">{description}</Typography>}
    </Paper>
  );
}
