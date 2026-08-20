import { Box } from "@mui/material";

import PatientHeader from "../Components/PatientHeader";
import PatientSearch from "../Components/PatientSearch";
import PatientList from "../Components/PatientList";

import { useEffect, useState } from "react";


export default function Patients(){

    const [patients,setPatients] = useState([]);
    const [error,setError] = useState("");


    useEffect(()=>{


        const getPatients = async()=>{

            try{

                const fetchApi = await fetch(
                    "https://localhost:7066/api/patients"
                );


                if(!fetchApi.ok){

                    setError("Data not Found");

                }


                const response = await fetchApi.json();


                setPatients(response);


            }
            catch(error){

               
                console.log("error")

            }


        };


        getPatients();


    },[]);




return (

<Box

sx={{

width:"100%"

}}

>


{
error && <h3>{error}</h3>
}


<PatientHeader />

<PatientSearch />

<PatientList patients={patients}/>


</Box>

)

}