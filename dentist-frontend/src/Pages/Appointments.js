import {
  Box
} from "@mui/material";


import { useState } from "react";
import dayjs from "dayjs";


import Sidebar from "../Components/Sidebar";

import AppointmentStats from "../Components/Appointmentstats";
import CalendarToolbar from "../Components/CalendarToolbar";
import WeeklyCalendar from "../Components/WeeklyCalendar";
import AppointmentHeader from "../Components/AppointmentHeader";



export default function Appointments(){


const [currentDate,setCurrentDate] = useState(dayjs());



return (

<Box

sx={{

display:"flex",

background:"#faf8f2",

minHeight:"100vh"

}}

>


<Sidebar/>




<Box

component="main"

sx={{

flexGrow:1,

ml:"280px",

p:4,

width:"calc(100% - 280px)",

overflowX:"hidden"

}}

>



<AppointmentHeader/>




<AppointmentStats/>





<CalendarToolbar

currentDate={currentDate}

setCurrentDate={setCurrentDate}

/>





<WeeklyCalendar

currentDate={currentDate}

/>





</Box>


</Box>


)

}