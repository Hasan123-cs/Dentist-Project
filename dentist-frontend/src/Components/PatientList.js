import {
    Box,
    Typography,
    Grid
} from "@mui/material";


import PatientCard from "./PatientCard";







export default function PatientList({patients}){





return (


<Box

sx={{

width:"100%"

}}

>





<Typography

fontSize={20}

fontWeight={800}

color="#092c57"

mb={3}

textAlign="center"

>

All Patients ({patients.length})

</Typography>









<Grid

container

spacing={4}

sx={{

width:"100%",

margin:0

}}

>


{


patients.map((p)=>(


<Grid

item

key={p.id}

xs={12}

sm={6}

md={4}

lg={3}

sx={{

display:"flex"

}}

>


<Box

sx={{

width:"100%"

}}

>


<PatientCard

patient={{

id:p.id,

name:

`${p.firstName} ${p.lastName}`,

phone:

p.phone || "No phone",

status:"Active",

lastVisit:

p.createdAt

?

new Date(
p.createdAt
).toLocaleDateString()

:

"No visits",

balance:"$0.00"

}}

/>



</Box>



</Grid>


))


}



</Grid>






</Box>


)


}