import {
Box,
Typography,
Button
} from "@mui/material";


export default function AppointmentHeader(){


return (

<Box

display="flex"

justifyContent="space-between"

alignItems="center"

mb={3}

>


<Box>

<Typography

fontSize={30}

fontWeight={800}

color="#3d2f12"

>

Appointments

</Typography>


<Typography

color="#8a7a55"

>

Manage your scheduling and appointments

</Typography>


</Box>




<Button

variant="contained"

sx={{

background:"#C9A227",

fontWeight:700,

px:3,

"&:hover":{
background:"#A88418"
}

}}

>

+ New Appointment

</Button>


</Box>


)

}