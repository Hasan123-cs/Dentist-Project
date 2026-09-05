import {
  Box,
  Typography,
  Grid
} from "@mui/material";


import {
  useEffect,
  useState
} from "react";


import axios from "axios";


import TreatmentCard from "./TreatmentCard";





export default function TreatmentList(){


const [treatments,setTreatments] = useState([]);






useEffect(()=>{


const getTreatments = async()=>{


try{


const response = await axios.get(
"https://localhost:7166/api/treatments/all"
);



const data = response.data.map(t => ({


id:t.id,


patientId:t.patientId,


patient:t.patient,


treatment:t.treatment,


tooth:t.tooth || "N/A",


status:t.status,


price:`$${t.price}`,


duration:t.duration,


date:new Date(
t.date
).toLocaleDateString(),


notes:t.notes || "No notes"



}));




setTreatments(data);



}

catch(error){


console.log(
"Error loading treatments:",
error
);


}



};



getTreatments();



},[]);









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