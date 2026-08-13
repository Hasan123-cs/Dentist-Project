import {
    Box,
    Typography,
    Grid
} from "@mui/material";


import PatientCard from "./PatientCard";



const patients=[

{
    id:1,
    name:"Amanda White",
    email:"amanda.white@email.com",
    phone:"+1 555 456-8901",
    status:"Active",
    lastVisit:"12 Aug 2026",
    balance:"$0.00"
},

{
    id:2,
    name:"Ashley Young",
    email:"ashley.young@email.com",
    phone:"+1 555 012-4567",
    status:"Active",
    lastVisit:"05 Aug 2026",
    balance:"$120.00"
},

{
    id:3,
    name:"Brian Lewis",
    email:"brian.lewis@email.com",
    phone:"+1 555 789-1234",
    status:"Active",
    lastVisit:"28 Jul 2026",
    balance:"$50.00"
},

{
    id:4,
    name:"Christopher Taylor",
    email:"chris.taylor@email.com",
    phone:" +1 555 567-9012",
    status:"Inactive",
    lastVisit:"15 Jun 2026",
    balance:"$0.00"
}

];



export default function PatientList(){


return (

<Box>


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

display:"flex",

justifyContent:"center"

}}

>


<Box

sx={{

width:"100%"

}}

>

<PatientCard patient={p}/>


</Box>


</Grid>


))
}


</Grid>



</Box>

)

}