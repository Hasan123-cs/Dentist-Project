import {
    Box,
    Typography
} from "@mui/material";


import PatientCard from "./PatientCard";



const patients=[


{
    id:1,
    name:"Amanda White",
    email:"amanda.white@email.com",
    phone:"+1 555 456-8901"
},


{
    id:2,
    name:"Ashley Young",
    email:"ashley.young@email.com",
    phone:"+1 555 012-4567"
},


{
    id:3,
    name:"Brian Lewis",
    email:"brian.lewis@email.com",
    phone:"+1 555 789-1234"
},



{
    id:4,
    name:"Christopher Taylor",
    email:"chris.taylor@email.com",
    phone:"+1 555 567-9012"
}



];



export default function PatientList(){



return (


<Box>



<Typography

fontWeight={800}

color="#092c57"

mb={2}

>

All Patients ({patients.length})

</Typography>





{

patients.map((p)=>(


<PatientCard

key={p.id}

patient={p}

/>


))

}



</Box>


)


}