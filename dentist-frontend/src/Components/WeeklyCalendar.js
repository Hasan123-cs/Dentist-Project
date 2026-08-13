import {
    Box,
    Paper
} from "@mui/material";


import { useState } from "react";


import AppointmentCard from "../Components/AppointmentCard";



const times = [

    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"

];





export default function WeeklyCalendar({

    currentDate,

    view

}) {



const [draggedAppointment,setDraggedAppointment] = useState(null);





const [appointments,setAppointments] = useState([


{
id:1,
day:0,
time:"09:00",
patient:"Jane Smith",
treatment:"Cleaning",
status:"confirmed"
},


{
id:2,
day:0,
time:"11:00",
patient:"John Miller",
treatment:"Root Canal",
status:"scheduled"
},


{
id:3,
day:1,
time:"10:00",
patient:"Sarah Johnson",
treatment:"Crown",
status:"completed"
},


{
id:4,
day:2,
time:"13:00",
patient:"David Brown",
treatment:"Implant",
status:"confirmed"
},


{
id:5,
day:4,
time:"15:00",
patient:"Michael Jones",
treatment:"Filling",
status:"scheduled"
},


{
id:6,
day:6,
time:"12:00",
patient:"Robert Davis",
treatment:"Cleaning",
status:"completed"
},


{
id:7,
day:0,
time:"09:00",
patient:"Anna White",
treatment:"Crown",
status:"scheduled"
}



]);









const startOfWeek = currentDate
.startOf("week")
.add(1,"day");






let days=[];



if(view==="day"){


days=[

currentDate

];


}


else if(view==="3days"){


days=[

currentDate,

currentDate.add(1,"day"),

currentDate.add(2,"day")

];


}


else{


days=

Array.from(

{length:7},

(_,i)=>

startOfWeek.add(i,"day")

);


}









return (


<Paper


sx={{


mt:3,

borderRadius:4,

overflow:"hidden",

border:"1px solid #eee3c5",

background:"#fff"

}}


>







{/* HEADER */}



<Box


sx={{


display:"grid",

gridTemplateColumns:

`80px repeat(${days.length},1fr)`


}}


>



<Box/>




{

days.map(day=>(


<Box


key={day.format()}


sx={{


p:2,

textAlign:"center",

borderLeft:"1px solid #eee3c5",

fontWeight:700

}}


>


{day.format("ddd")}

<br/>

{day.format("D")}



</Box>



))


}




</Box>









{/* BODY */}



{


times.map(time=>(



<Box


key={time}


sx={{


display:"grid",

gridTemplateColumns:

`80px repeat(${days.length},1fr)`,

height:80


}}


>






{/* TIME */}



<Box


sx={{


display:"flex",

justifyContent:"center",

alignItems:"flex-start",

pt:1,

fontSize:14


}}


>


{time}


</Box>








{

days.map((day,index)=>{



const cellAppointments =

appointments.filter(

item=>

item.day===index &&

item.time===time

);





return (


<Box


key={index}




onDragOver={(e)=>{

e.preventDefault();

}}






onDrop={()=>{



if(!draggedAppointment)

return;




setAppointments(prev=>

prev.map(item=>

item.id===draggedAppointment.id

?

{

...item,

day:index,

time:time

}

:

item

)

);



setDraggedAppointment(null);



}}





sx={{


borderLeft:

"1px solid #eee3c5",


borderTop:

"1px solid #eee3c5",


p:0.5,


display:"flex",


gap:0.5,


overflow:"hidden"


}}


>




{


cellAppointments.map(app=>(


<Box


key={app.id}


sx={{


width:

`${100 / cellAppointments.length}%`


}}


>


<AppointmentCard


appointment={app}



onDragStart={(appointment)=>{


setDraggedAppointment(

appointment

);


}}



/>



</Box>



))


}





</Box>


)



})


}








</Box>


))


}






</Paper>


);


}