import {
    Paper,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Button
} from "@mui/material";


import {
    MoreHoriz,
    Email,
    Phone,
    CalendarMonth,
    Payments,
    ArrowForward
} from "@mui/icons-material";


import {
    useNavigate
} from "react-router-dom";





export default function PatientCard({patient}){


const navigate = useNavigate();



return (


<Paper


sx={{


width:"100%",

height:520,

boxSizing:"border-box",


p:3,


borderRadius:4,


border:"1px solid #eee3c5",


background:"#fff",


display:"flex",


flexDirection:"column",


justifyContent:"space-between",



cursor:"pointer",



transition:"0.25s",



"&:hover":{

boxShadow:"0 10px 25px rgba(0,0,0,.12)",

transform:"translateY(-4px)"

}


}}



>






{/* TOP SECTION */}



<Box>



<Box

display="flex"

justifyContent="space-between"

alignItems="center"

>


<Avatar

sx={{

width:70,

height:70,

background:"#eef2f7",

color:"#092c57",

fontSize:22,

fontWeight:800

}}

>


{

patient.name

.split(" ")

.map(x=>x[0])

.join("")

}


</Avatar>






<IconButton

onClick={(e)=>e.stopPropagation()}

>


<MoreHoriz

color="action"

/>


</IconButton>



</Box>







<Box

textAlign="center"

mt={2}

>



<Typography

fontSize={18}

fontWeight={800}

color="#092c57"

>

{patient.name}

</Typography>






<Chip

label={patient.status || "Active"}

size="small"

sx={{

mt:1,


background:

patient.status==="Inactive"

?

"#9ca3af"

:

"#16a34a",


color:"#fff",

fontWeight:700

}}


/>



</Box>





{/* CONTACT */}



<Box

mt={3}

textAlign="center"

>



<Email

sx={{

color:"#C9A227",

fontSize:22

}}

/>



<Typography

fontSize={14}

mt={1}

>

{patient.email}

</Typography>







<Phone

sx={{

color:"#C9A227",

fontSize:22,

mt:2

}}

/>




<Typography

fontSize={14}

>

{patient.phone}

</Typography>



</Box>







{/* INFO */}



<Box

mt={3}

textAlign="center"

>



<CalendarMonth

sx={{

color:"#C9A227",

fontSize:22

}}

/>



<Typography

fontSize={13}

color="#718096"

>

Last Visit

</Typography>



<Typography

fontWeight={700}

>

{patient.lastVisit || "Not scheduled"}

</Typography>






<Payments

sx={{

color:"#C9A227",

fontSize:22,

mt:2

}}

/>



<Typography

fontSize={13}

color="#718096"

>

Balance

</Typography>



<Typography

fontWeight={700}

color={

patient.balance !== "$0.00"

?

"#d97706"

:

"green"

}

>

{patient.balance || "$0.00"}

</Typography>



</Box>



</Box>







{/* BUTTON */}



<Button


fullWidth


variant="contained"


endIcon={<ArrowForward/>}



onClick={()=>navigate(`/patients/${patient.id}`)}



sx={{


background:"#C9A227",


borderRadius:3,


py:1.3,


fontWeight:800,


fontSize:13,



"&:hover":{

background:"#b18c1f"

}


}}


>


VIEW PATIENT PROFILE


</Button>






</Paper>


)

}