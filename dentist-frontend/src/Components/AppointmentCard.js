import { Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";


const colors = {

scheduled:{
bg:"#dbeafe",
border:"#2563eb"
},

confirmed:{
bg:"#dcfce7",
border:"#16a34a"
},

completed:{
bg:"#f8e8a5",
border:"#C9A227"
},

cancelled:{
bg:"#fee2e2",
border:"#dc2626"
}

};





export default function AppointmentCard({

appointment,
onDragStart,
cancelAppointment

}){


const statusKey =
appointment.status?.toLowerCase()
||
"scheduled";


const style =
colors[statusKey]
||
colors.scheduled;



const startTime =
dayjs(
appointment.startDateTime
)
.format("HH:mm");



const endTime =
dayjs(
appointment.endDateTime
)
.format("HH:mm");





return(


<Box


draggable


onDragStart={()=>{

onDragStart(appointment);

}}



sx={{


width:"100%",


height:"100%",


background:style.bg,


borderLeft:
`4px solid ${style.border}`,


borderRadius:2,


p:0.5,


overflow:"hidden",


display:"flex",


flexDirection:"column",


justifyContent:"space-between",


boxSizing:"border-box"



}}


>



<Typography

fontSize={11}

fontWeight={700}

color="#1e293b"

noWrap

>

{appointment.patientName || "No Name"}

</Typography>






<Typography

fontSize={10}

fontWeight={600}

color={style.border}

noWrap

>

{startTime} - {endTime}

</Typography>






<Typography

fontSize={9}

fontWeight={700}

sx={{

color:style.border,

textTransform:"capitalize"

}}

noWrap

>

{appointment.status || "Scheduled"}

</Typography>







<Button

size="small"

variant="contained"

color="error"


onMouseDown={(e)=>{

e.stopPropagation();

}}



onClick={(e)=>{

e.preventDefault();

e.stopPropagation();


if(cancelAppointment){

cancelAppointment(
appointment.id
);

}


}}


sx={{


height:14,


minHeight:14,


fontSize:7,


padding:"0 5px",


lineHeight:1,


mt:0.3,


textTransform:"none"



}}


>

Cancel

</Button>





</Box>


);


}