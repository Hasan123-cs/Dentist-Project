import {
    Paper,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton
} from "@mui/material";


import {
    MoreHoriz
} from "@mui/icons-material";


import {
    useNavigate
} from "react-router-dom";



export default function PatientCard({patient}){


    const navigate = useNavigate();



    return (


        <Paper


            onClick={()=>{

                navigate(`/patients/${patient.id}`);

            }}


            sx={{


                p:2,


                mb:1.5,


                borderRadius:3,


                border:"1px solid #eee3c5",


                display:"flex",


                alignItems:"center",


                justifyContent:"space-between",


                cursor:"pointer",


                "&:hover":{

                    boxShadow:"0 4px 15px rgba(0,0,0,.12)"

                }


            }}



        >



            <Box
                display="flex"
                alignItems="center"
                gap={2}
            >


                <Avatar

                    sx={{

                        background:"#eef2f7",

                        color:"#092c57"

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

                        fontWeight={700}

                        color="#092c57"

                    >

                        {patient.name}

                    </Typography>




                    <Typography

                        fontSize={13}

                        color="#718096"

                    >

                        ✉ {patient.email}   ☎ {patient.phone}

                    </Typography>


                </Box>



            </Box>







            <Box

                display="flex"

                alignItems="center"

                gap={4}

            >




                <Box textAlign="center">


                    <Typography
                        fontSize={12}
                        color="#718096"
                    >

                        Last Visit

                    </Typography>


                    <Typography>

                        Not scheduled

                    </Typography>


                </Box>







                <Box textAlign="center">


                    <Typography
                        fontSize={12}
                        color="#718096"
                    >

                        Next Appointment

                    </Typography>


                    <Typography>

                        Not scheduled

                    </Typography>


                </Box>







                <Box textAlign="center">


                    <Typography
                        fontSize={12}
                        color="#718096"
                    >

                        Balance

                    </Typography>


                    <Typography color="green">

                        $0.00

                    </Typography>


                </Box>







                <Chip

                    label="Active"

                    size="small"

                    sx={{

                        background:"#16a34a",

                        color:"white",

                        fontWeight:700

                    }}

                />







                <IconButton

                    onClick={(e)=>{

                        e.stopPropagation();

                    }}

                >

                    <MoreHoriz/>

                </IconButton>





            </Box>





        </Paper>


    )


}