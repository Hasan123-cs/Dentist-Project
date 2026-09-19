import { Box } from "@mui/material";

import TreatmentHeader from "../Components/TreatmentHeader";
import TreatmentStats from "../Components/TreatmentStats";
import TreatmentList from "../Components/TreatmentList";
import TreatmentSearch from "../Components/TreatmentSearch";
import { useState } from "react";

export default function Treatments() {
  const [search, setSearch] = useState("");
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#faf8f2",
        px: 3,
        py: 3,
        boxSizing: "border-box",
      }}
    >
      <TreatmentHeader />
      <TreatmentSearch search={search} setSearch={setSearch} />
      <TreatmentStats />

      <TreatmentList search={search} />
    </Box>
  );
}
