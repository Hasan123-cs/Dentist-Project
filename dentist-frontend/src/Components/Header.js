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
                width:"100%",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
            }}
        >


            <Typography
                sx={{
                    fontSize:42,
                    fontWeight:700,
                    color:"black",
                }}
            >
                {formattedDate}
            </Typography>



            <Typography
                sx={{
                    fontSize:42,
                    fontWeight:700,
                    color:"black",
                }}
            >
                {greeting}, {dashboardData?.userName || "Doctor"}
            </Typography>




            <Typography
                fontSize={17}
                color="text.secondary"
                sx={{
                    mt:1
                }}
            >

                You have{" "}
                <b>{dashboardData?.todaysAppointments || 0} appointments</b>{" "}
                scheduled for today •{" "}
                <b>{dashboardData?.confirmedAppointments || 0}</b> confirmed,{" "}
                <b>{dashboardData?.pendingAppointments || 0}</b> pending

            </Typography>




            <Button

                variant="contained"

                sx={{

                    mt:1.5,   

                    mb:3,    

                    borderRadius:3,

                    px:4,

                    py:1.5,

                    backgroundColor:"#C9A227",

                    fontWeight:700,

                    "&:hover":{

                        backgroundColor:"#B08A1D"

                    }

                }}

            >

                + QUICK ADD

            </Button>


        </Box>

    );

}