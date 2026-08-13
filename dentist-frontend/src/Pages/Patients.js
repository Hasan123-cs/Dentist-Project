import { Box } from "@mui/material";

import PatientHeader from "../Components/PatientHeader";
import PatientSearch from "../Components/PatientSearch";
import PatientList from "../Components/PatientList";


export default function Patients(){

return (

<Box

sx={{

width:"100%"

}}

>


<PatientHeader />

<PatientSearch />

<PatientList />


</Box>

)

}