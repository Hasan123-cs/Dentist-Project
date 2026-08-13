import {
    Box
} from "@mui/material";


import { useState } from "react";

import dayjs from "dayjs";


import AppointmentStats from "../Components/Appointmentstats";
import CalendarToolbar from "../Components/CalendarToolbar";
import WeeklyCalendar from "../Components/WeeklyCalendar";
import AppointmentHeader from "../Components/AppointmentHeader";



export default function Appointments(){


const [currentDate,setCurrentDate] = useState(dayjs());


// NEW
const [view,setView] = useState("week");



return (


<Box

sx={{

width:"100%",

minHeight:"100vh",

background:"#faf8f2",

boxSizing:"border-box"

}}

>





<AppointmentHeader />







<AppointmentStats />









<CalendarToolbar


currentDate={currentDate}


setCurrentDate={setCurrentDate}


view={view}


setView={setView}


/>









<WeeklyCalendar


currentDate={currentDate}


view={view}


/>









</Box>


)


}