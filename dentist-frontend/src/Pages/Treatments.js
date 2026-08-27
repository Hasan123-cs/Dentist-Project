import { Box } from "@mui/material";

import TreatmentHeader from "../Components/TreatmentHeader";
import TreatmentStats from "../Components/TreatmentStats";
import TreatmentList from "../Components/TreatmentList";


export default function Treatments(){

  return (

    <Box
      sx={{
        width:"100%",
        minHeight:"100vh",
        background:"#faf8f2",
        px:3,
        py:3,
        boxSizing:"border-box"
      }}
    >

      <TreatmentHeader />

      <TreatmentStats />

      <TreatmentList />

    </Box>

  );

}