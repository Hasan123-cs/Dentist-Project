import { Box, Typography, Button } from "@mui/material";


export default function Header({ dashboardData }) {


    const today = new Date();


    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });



    const hour = today.getHours();


    let greeting = "Good morning";


    if (hour >= 12 && hour < 17) {

        greeting = "Good afternoon";

    }
    else if (hour >= 17) {

        greeting = "Good evening";

    }






    return (



        <Box

            sx={{

                width: "100%",

                display: "flex",

                flexDirection: "column",

                alignItems: "flex-start",

                mb: 3

            }}

        >





            <Typography

                sx={{
                    fontSize: {
                        xs: 24,
                        sm: 32,
                        md: 42,
                    },
                    fontWeight: 800,
                    color: "#111",
                }}

            >

                {formattedDate}

            </Typography>









            <Typography

                sx={{
                    fontSize: {
                        xs: 24,
                        sm: 32,
                        md: 42,
                    },
                    fontWeight: 800,
                    color: "#111",
                }}

            >

                {greeting}, {dashboardData?.userName || "Doctor"}

            </Typography>









            <Typography

                sx={{
                    fontSize: {
                        xs: 14,
                        sm: 16,
                        md: 17,
                    },
                    mt: 1
                }}

                color="text.secondary"



            >

                You have{" "}

                <b>
                    {dashboardData?.todaysAppointments || 0} appointments
                </b>{" "}

                scheduled for today •{" "}

                <b>
                    {dashboardData?.confirmedAppointments || 0}
                </b>{" "}

                confirmed,{" "}

                <b>
                    {dashboardData?.pendingAppointments || 0}
                </b>{" "}

                pending

            </Typography>













        </Box>


    );


}