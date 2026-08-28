import { Box } from "@mui/material";

import PatientHeader from "../Components/PatientHeader";
import PatientSearch from "../Components/PatientSearch";
import PatientList from "../Components/PatientList";

import { useEffect, useState } from "react";



export default function Patients() {


const [patients,setPatients]=useState([]);

const [filteredPatients,setFilteredPatients]=useState([]);

const [search,setSearch]=useState("");

const [error,setError]=useState("");





useEffect(()=>{


const getPatients=async()=>{


try{


const fetchApi = await fetch(
"https://localhost:7166/api/patients"
);



if(!fetchApi.ok){

setError("Data not Found");

return;

}



const response = await fetchApi.json();



setPatients(response);

setFilteredPatients(response);



}

catch(error){


console.log(error);

setError("Connection Error");


}



};



getPatients();


},[]);








useEffect(()=>{


const value = search.toLowerCase();



const result = patients.filter((p)=>{


const fullName =

`${p.firstName} ${p.lastName}`

.toLowerCase();



return (

fullName.includes(value)

||

p.phone?.includes(value)

);



});



setFilteredPatients(result);



},[search,patients]);










return(


<Box

sx={{

width:"100%"

}}

>


{

error &&

<h3>

{error}

</h3>

}



<PatientHeader />




<PatientSearch

search={search}

setSearch={setSearch}

/>





<PatientList

patients={filteredPatients}

/>





</Box>


);


}