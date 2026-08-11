import { Box, Typography } from "@mui/material";


const colors = {

    scheduled: {
        bg: "#dbeafe",
        border: "#2563eb",
    },

    confirmed: {
        bg: "#dcfce7",
        border: "#16a34a",
    },

    completed: {
        bg: "#f8e8a5",
        border: "#C9A227",
    },

    cancelled: {
        bg: "#fee2e2",
        border: "#dc2626",
    },

};



export default function AppointmentCard({
    appointment,
    onDragStart
}) {


    const style =
        colors[appointment.status] || colors.scheduled;



    return (

        <Box

            draggable

            onDragStart={() =>
                onDragStart(appointment)
            }


            sx={{

                width:"100%",

                minHeight:65,


                background:style.bg,


                borderLeft:
                `4px solid ${style.border}`,


                borderRadius:2,


                p:1,


                cursor:"grab",


                overflow:"hidden",


                "&:hover":{

                    boxShadow:
                    "0 4px 15px rgba(0,0,0,.15)"

                }

            }}


        >


            <Typography

                fontSize={12}

                fontWeight={700}

                color="#3d2f12"

                noWrap

            >

                {appointment.patient}

            </Typography>



            <Typography

                fontSize={11}

                noWrap

            >

                {appointment.treatment}

            </Typography>




            <Typography

                fontSize={10}

                color="#8a7a55"

            >

                {appointment.status}

            </Typography>



        </Box>

    );

}