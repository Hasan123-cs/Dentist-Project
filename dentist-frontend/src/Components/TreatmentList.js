import {
  Box,
  Typography,
  Grid
} from "@mui/material";

import TreatmentCard from "./TreatmentCard";

import { useEffect, useState } from "react";



export default function TreatmentList(){


  const [treatments, setTreatments] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    const loadTreatments = async () => {


      try {


        const token = localStorage.getItem("token");


        const response = await fetch(
          "https://localhost:7166/api/patients/all-treatments",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );



        if(!response.ok){

          throw new Error(
            "Failed to load treatments"
          );

        }



        const data = await response.json();



        console.log(
          "Treatments:",
          data
        );



        setTreatments(data);



      }catch(error){


        console.error(
          error
        );


      }finally{


        setLoading(false);


      }


    };



    loadTreatments();


  }, []);




  if(loading){

    return (

      <Typography>
        Loading treatments...
      </Typography>

    );

  }





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