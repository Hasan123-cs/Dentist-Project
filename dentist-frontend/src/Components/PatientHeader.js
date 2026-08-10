import {
Box,
Typography,
Button
} from "@mui/material";

import {
Add,
Upload
} from "@mui/icons-material";


export default function PatientHeader(){

return (

<Box
display="flex"
justifyContent="space-between"
alignItems="center"
mb={3}
>


<Box>

<Typography
fontSize={28}
fontWeight={800}
color="#092c57"
>
Patients
</Typography>


<Typography
color="#718096"
>
Manage your patient database
</Typography>

</Box>



<Box
display="flex"
gap={2}
>


<Button
variant="outlined"
startIcon={<Upload/>}
sx={{
borderColor:"#C9A227",
color:"#8a6d1d"
}}
>
Import Patients
</Button>



<Button

startIcon={<Add/>}

sx={{
background:"#C9A227",
color:"#fff",
fontWeight:700,

"&:hover":{
background:"#b18c1f"
}
}}

>
Add Patient
</Button>


</Box>


</Box>

)

}