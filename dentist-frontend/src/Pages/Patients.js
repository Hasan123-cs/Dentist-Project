import {
  Box
} from "@mui/material";


import Sidebar from "../Components/Sidebar";

import PatientHeader from "../Components/PatientHeader";
import PatientSearch from "../Components/PatientSearch";
import PatientList from "../Components/PatientList";



export default function Patients(){


return (


<Box

sx={{

display:"flex",

background:"#faf8f2",

minHeight:"100vh"

}}

>



{/* Sidebar */}

<Sidebar/>





{/* Content */}


<Box


component="main"


sx={{


flex:1,


ml:"280px",


p:4,


width:"calc(100% - 280px)",


overflowX:"hidden"


}}



>



<PatientHeader/>


<PatientSearch/>


<PatientList/>





</Box>




</Box>


)


}