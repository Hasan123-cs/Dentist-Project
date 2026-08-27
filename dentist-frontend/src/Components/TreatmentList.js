import {
  Box,
  Typography,
  Grid
} from "@mui/material";

import TreatmentCard from "./TreatmentCard";


const treatments=[

{
  id:1,
  patient:"John Smith",
  treatment:"Root Canal",
  tooth:"36",
  status:"Completed",
  price:"$450",
  duration:"90 min",
  date:"12 Aug 2026",
  notes:"Completed successfully"
},

{
  id:2,
  patient:"Sarah Johnson",
  treatment:"Dental Crown",
  tooth:"14",
  status:"In Progress",
  price:"$800",
  duration:"60 min",
  date:"15 Aug 2026",
  notes:"Temporary crown placed"
},

{
  id:3,
  patient:"Michael Brown",
  treatment:"Filling",
  tooth:"25",
  status:"Pending",
  price:"$150",
  duration:"30 min",
  date:"18 Aug 2026",
  notes:"Waiting for appointment"
},

{
  id:4,
  patient:"Anna White",
  treatment:"Implant",
  tooth:"46",
  status:"Completed",
  price:"$1200",
  duration:"120 min",
  date:"20 Aug 2026",
  notes:"Implant completed"
}

];



export default function TreatmentList(){


return (

<Box

sx={{

width:"100%",

mt:3

}}

>


<Typography

fontSize={22}

fontWeight={800}

color="#092c57"

mb={3}

>

All Treatments ({treatments.length})

</Typography>




<Grid

container

spacing={3}

sx={{

width:"100%",

margin:0

}}

>


{
treatments.map(item=>(


<Grid

item

xs={12}

sm={6}

md={4}

lg={3}

key={item.id}

sx={{

display:"flex"

}}

>


<Box

sx={{

width:"100%"

}}

>


<TreatmentCard

treatment={item}

/>


</Box>


</Grid>


))

}


</Grid>


</Box>

);

}