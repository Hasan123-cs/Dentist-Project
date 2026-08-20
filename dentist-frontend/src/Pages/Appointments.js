import { Box } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

import AppointmentStats from "../Components/Appointmentstats";
import CalendarToolbar from "../Components/CalendarToolbar";
import WeeklyCalendar from "../Components/WeeklyCalendar";
import AppointmentHeader from "../Components/AppointmentHeader";


export default function Appointments(){

    const [currentDate,setCurrentDate] = useState(dayjs());

    const [view,setView] = useState("week");


    return (

        <Box
            sx={{
                width:"100%",
                background:"#faf8f2",
                boxSizing:"border-box"
            }}
        >


            <AppointmentHeader />


            <Box
                sx={{
                    width:"100%",
                    mt:3
                }}
            >
                <AppointmentStats />
            </Box>



            <Box
                sx={{
                    width:"100%",
                    mt:3
                }}
            >

                <CalendarToolbar
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    view={view}
                    setView={setView}
                />

            </Box>




            <Box
                sx={{
                    width:"100%",
                    mt:3
                }}
            >

                <WeeklyCalendar
                    currentDate={currentDate}
                    view={view}
                />

            </Box>


        </Box>

    );

}