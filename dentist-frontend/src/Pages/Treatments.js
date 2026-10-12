import { Box } from "@mui/material";

import TreatmentHeader from "../Components/TreatmentHeader";
import TreatmentStats from "../Components/TreatmentStats";
import TreatmentList from "../Components/TreatmentList";
import TreatmentSearch from "../Components/TreatmentSearch";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
export default function Treatments() {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#faf8f2",
        px: { xs: 0, md: 3 },
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
