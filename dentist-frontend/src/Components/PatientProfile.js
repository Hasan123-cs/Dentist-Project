import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    Chip,
    Grid
} from "@mui/material";


import {
    useNavigate,
    useParams
} from "react-router-dom";


import DentalChart from "../Components/DentalChart";
import ConditionLegend from "../Components/ConditionLegend";





const patients = [


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






export default function PatientProfile(){



    const {id}=useParams();


    const navigate=useNavigate();




    const patient = patients.find(
        p => p.id === Number(id)
    );






    if(!patient){


        return (

            <Box p={4}>


                <Typography>

                    Patient not found

                </Typography>


            </Box>

        )

    }








return (



<Box


sx={{


    p:4,


    background:"#faf8f2",


    minHeight:"100vh"


}}



>









{/* HEADER */}




<Paper


sx={{


    p:3,


    borderRadius:4,


    border:"1px solid #eee3c5"


}}



>



<Box


display="flex"


justifyContent="space-between"


alignItems="center"


>







<Box


display="flex"


gap={2}


alignItems="center"


>




<Avatar


sx={{


    width:70,


    height:70,


    bgcolor:"#eef2f7",


    color:"#092c57",


    fontSize:22


}}


>


{

patient.name

.split(" ")

.map(x=>x[0])

.join("")

}



</Avatar>









<Box>



<Typography


variant="h5"


fontWeight={800}


color="#092c57"


>


{patient.name}



</Typography>







<Chip


label="Active"


sx={{


    background:"#16a34a",


    color:"white",


    mt:1


}}



/>








<Typography


color="#718096"


mt={1}


>


Patient ID #{patient.id}



</Typography>





</Box>







</Box>













<Box


display="flex"


gap={1}


>





<Button>

Chairside Mode

</Button>





<Button>

Export PDF

</Button>





<Button


onClick={()=>navigate("/patients")}


>

Back

</Button>





<Button


variant="contained"


sx={{


    bgcolor:"#092c57"


}}


>

Edit

</Button>






</Box>








</Box>






</Paper>













{/* DENTAL CHART */}





<Paper


sx={{


    mt:3,


    p:4,


    borderRadius:4,


    border:"1px solid #eee3c5"


}}



>



<DentalChart />



<ConditionLegend />



</Paper>















{/* INFORMATION CARDS */}





<Grid


container


spacing={2}


mt={1}


>



{


[


"Contact Information",


"Personal Information",


"Financial Information",


"Recent Appointments"


]


.map(item=>(




<Grid


item


xs={12}


md={6}


key={item}


>



<Paper


sx={{


    p:3,


    borderRadius:4,


    border:"1px solid #eee3c5"


}}



>




<Typography


fontWeight={800}


color="#092c57"


>


{item}



</Typography>









{

item==="Contact Information" &&



<Typography


mt={2}


color="#718096"


>


✉ {patient.email}


<br/>

☎ {patient.phone}



</Typography>


}








{

item==="Personal Information" &&



<Typography


mt={2}


color="#718096"


>


Gender: Not set


<br/>

Date of Birth: Not set



</Typography>


}








{

item==="Financial Information" &&



<Typography


mt={2}


color="#718096"


>


Balance: $0.00



</Typography>


}








{

item==="Recent Appointments" &&



<Typography


mt={2}


color="#718096"


>


No appointments yet



</Typography>


}





</Paper>





</Grid>




))



}






</Grid>







</Box>



)


}