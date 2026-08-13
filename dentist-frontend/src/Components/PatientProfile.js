import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    Chip,
    Grid,
    Tabs,
    Tab
} from "@mui/material";


import {
    useNavigate,
    useParams
} from "react-router-dom";


import {
    Email,
    Phone,
    Person,
    Payments,
    CalendarMonth
} from "@mui/icons-material";


import { useState } from "react";


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


const [tab,setTab]=useState(0);





const patient = patients.find(
    p=>p.id===Number(id)
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

width:"100%",

background:"#faf8f2",

minHeight:"100vh"

}}

>







{/* HEADER */}



<Paper

sx={{

p:3,

borderRadius:4,

border:"1px solid #eee3c5",

mb:3

}}

>


<Box

display="flex"

justifyContent="space-between"

alignItems="center"

>





{/* PATIENT INFO */}



<Box

display="flex"

gap={3}

alignItems="center"

flex={1}

>


<Avatar

sx={{

width:85,

height:85,

background:"#eef2f7",

color:"#C9A227",

fontSize:28

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

fontSize={28}

fontWeight={800}

color="#092c57"

>

{patient.name}

</Typography>





<Chip

label="Active Patient"

sx={{

mt:1,

background:"#16a34a",

color:"#fff",

fontWeight:700

}}

/>





<Typography

mt={1}

color="#718096"

>

Patient ID #{patient.id}

</Typography>



</Box>



</Box>









{/* ACTIONS */}



<Box

display="flex"

gap={1}

sx={{

marginLeft:"auto"

}}

>


<Button

sx={{

color:"#C9A227",

fontWeight:700

}}

>

Chairside Mode

</Button>



<Button

sx={{

color:"#C9A227",

fontWeight:700

}}

>

Export PDF

</Button>



<Button

onClick={()=>navigate("/patients")}

sx={{

color:"#C9A227",

fontWeight:700

}}

>

Back

</Button>



<Button

variant="contained"

sx={{

background:"#C9A227",

fontWeight:700,

"&:hover":{

background:"#b18c1f"

}

}}

>

Edit

</Button>



</Box>





</Box>



</Paper>








{/* TABS */}



<Paper

sx={{

borderRadius:4,

border:"1px solid #eee3c5"

}}

>


<Tabs

value={tab}

onChange={(e,v)=>setTab(v)}

sx={{

"& .MuiTabs-indicator":{

background:"#C9A227"

}

}}

>


<Tab label="Overview"/>

<Tab label="Dental Chart"/>

<Tab label="Treatment Plan"/>

<Tab label="Images"/>


</Tabs>


</Paper>







{/* OVERVIEW */}



{

tab===0 &&


<Grid

container

spacing={3}

mt={3}

justifyContent="center"

alignItems="stretch"

>






{/* CONTACT */}



<Grid

item

xs={12}

sm={6}

md={3}

sx={{

display:"flex",

justifyContent:"center"

}}

>


<CardBox>


<Email color="warning"/>


<Title>

Contact Information

</Title>




<Typography>

{patient.email}

</Typography>




<Typography mt={1}>

<Phone fontSize="small"/>

{" "}

{patient.phone}

</Typography>



</CardBox>


</Grid>









{/* PERSONAL */}



<Grid

item

xs={12}

sm={6}

md={3}

sx={{

display:"flex",

justifyContent:"center"

}}

>


<CardBox>


<Person color="warning"/>


<Title>

Personal Information

</Title>




<Typography mt={1}>

Gender

</Typography>



<Typography color="text.secondary">

Not set

</Typography>





<Typography mt={1}>

Birth Date

</Typography>



<Typography color="text.secondary">

Not set

</Typography>



</CardBox>


</Grid>









{/* FINANCIAL */}



<Grid

item

xs={12}

sm={6}

md={3}

sx={{

display:"flex",

justifyContent:"center"

}}

>


<CardBox>


<Payments color="warning"/>


<Title>

Financial

</Title>





<Typography

fontSize={32}

fontWeight={800}

color="#C9A227"

>

$0.00

</Typography>




<Typography color="text.secondary">

Outstanding Balance

</Typography>



</CardBox>


</Grid>









{/* APPOINTMENTS */}



<Grid

item

xs={12}

sm={6}

md={3}

sx={{

display:"flex",

justifyContent:"center"

}}

>


<CardBox>


<CalendarMonth color="warning"/>


<Title>

Appointments

</Title>





<Typography

fontSize={32}

fontWeight={800}

color="#092c57"

>

0

</Typography>





<Typography color="text.secondary">

Upcoming Visits

</Typography>



</CardBox>


</Grid>





</Grid>


}









{/* DENTAL CHART */}



{

tab===1 &&


<Paper

sx={{

mt:3,

p:4,

borderRadius:4,

border:"1px solid #eee3c5"

}}

>


<Typography

fontSize={24}

fontWeight={800}

color="#C9A227"

mb={3}

>

Dental Chart

</Typography>




<DentalChart/>




<ConditionLegend/>




</Paper>


}









{/* TREATMENT PLAN */}



{

tab===2 &&


<Paper

sx={{

mt:3,

p:4,

borderRadius:4,

border:"1px solid #eee3c5"

}}

>


<Typography

fontSize={22}

fontWeight={800}

color="#C9A227"

>

Treatment Plan

</Typography>




<Typography

mt={2}

color="#718096"

>

No treatments added yet.

</Typography>



</Paper>


}









{/* IMAGES */}



{

tab===3 &&


<Paper

sx={{

mt:3,

p:4,

borderRadius:4,

border:"1px solid #eee3c5"

}}

>


<Typography

fontSize={22}

fontWeight={800}

color="#C9A227"

>

Patient Images

</Typography>




<Typography

mt={2}

color="#718096"

>

No images available.

</Typography>



</Paper>


}






</Box>


);


}








function CardBox({children}){


return (

<Paper

sx={{


p:3,


width:"260px",


height:170,


borderRadius:4,


border:"1px solid #eee3c5",


display:"flex",


flexDirection:"column",


justifyContent:"center",


alignItems:"center",


textAlign:"center",


gap:1,


transition:"0.3s",



"&:hover":{


transform:"translateY(-5px)",


boxShadow:"0 8px 25px rgba(0,0,0,.08)"


}



}}

>

{children}


</Paper>


)


}








function Title({children}){


return (

<Typography

fontWeight={800}

fontSize={16}

color="#092c57"

>

{children}

</Typography>


)

}