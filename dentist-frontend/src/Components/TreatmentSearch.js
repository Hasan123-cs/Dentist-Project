import { TextField, Box } from "@mui/material";

export default function TreatmentSearch({ search, setSearch }) {
  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search patient, treatment, tooth..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          background: "#fff",
          borderRadius: 2,
        }}
      />
    </Box>
  );
}
