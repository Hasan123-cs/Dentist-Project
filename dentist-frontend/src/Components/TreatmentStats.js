import {
    Grid,
    Paper,
    Box,
    Typography
} from "@mui/material";


import {
    MedicalServices,
    CheckCircle,
    Pending,
    AttachMoney
} from "@mui/icons-material";


import { useEffect, useState } from "react";



export default function TreatmentStats(){


    const [treatments, setTreatments] = useState([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {


        const loadTreatments = async () => {


            try {


                const token = localStorage.getItem("token");


                if (!token) {

                    console.error("No authentication token found.");

                    return;

                }



                const response = await fetch(
                    "https://localhost:7166/api/patients/all-treatments",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );



                if (!response.ok) {

                    throw new Error(
                        `Failed to load treatments: ${response.status}`
                    );

                }



                const data = await response.json();


                console.log("Treatment stats data:", data);


                setTreatments(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {


                console.error(
                    "Error loading treatment statistics:",
                    error
                );


            } finally {


                setLoading(false);

            }


        };


        loadTreatments();


    }, []);





    // =========================
    // CALCULATE STATISTICS
    // =========================


    const totalTreatments =
        treatments.length;



    const completedTreatments =
        treatments.filter(
            (treatment) =>
                treatment.status?.toLowerCase() === "completed"
        ).length;



    const pendingTreatments =
        treatments.filter(
            (treatment) =>
                treatment.status?.toLowerCase() === "pending" ||
                treatment.status?.toLowerCase() === "needstreatment"
        ).length;



    const totalRevenue =
        treatments.reduce(
            (total, treatment) => {

                const price =
                    Number(treatment.price) || 0;

                return total + price;

            },
            0
        );



    // =========================
    // FORMAT REVENUE
    // =========================


    const formattedRevenue =
        totalRevenue.toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );





    // =========================
    // STATS
    // =========================


    const stats = [


        {
            title:"Total Treatments",

            value: loading
                ? "..."
                : totalTreatments,

            icon:<MedicalServices />,

            color:"#C9A227"
        },


        {
            title:"Completed",

            value: loading
                ? "..."
                : completedTreatments,

            icon:<CheckCircle />,

            color:"#16a34a"
        },


        {
            title:"Pending",

            value: loading
                ? "..."
                : pendingTreatments,

            icon:<Pending />,

            color:"#f59e0b"
        },


        {
            title:"Total Revenue",

            value: loading
                ? "..."
                : formattedRevenue,

            icon:<AttachMoney />,

            color:"#2563eb"
        }


    ];





    return (


        <Grid

            container

            spacing={3}

            mb={4}

        >


            {

                stats.map((item)=>(


                    <Grid

                        item

                        xs={12}

                        sm={6}

                        lg={3}

                        key={item.title}

                    >


                        <Paper


                            sx={{


                                p:3,


                                height:140,


                                borderRadius:4,


                                border:"1px solid #eee3c5",


                                background:"#fff",


                                display:"flex",


                                alignItems:"center",


                                gap:2,


                                boxShadow:"0 3px 10px rgba(0,0,0,.05)"


                            }}


                        >


                            <Box


                                sx={{


                                    width:55,


                                    height:55,


                                    borderRadius:"50%",


                                    background:"#faf7ed",


                                    display:"flex",


                                    alignItems:"center",


                                    justifyContent:"center"


                                }}


                            >


                                <Box

                                    sx={{

                                        color:item.color,

                                        display:"flex"

                                    }}

                                >

                                    {item.icon}

                                </Box>


                            </Box>





                            <Box>


                                <Typography

                                    fontSize={13}

                                    color="#718096"

                                >

                                    {item.title}

                                </Typography>




                                <Typography

                                    fontSize={28}

                                    fontWeight={800}

                                    color="#092c57"

                                >

                                    {item.value}

                                </Typography>


                            </Box>


                        </Paper>


                    </Grid>


                ))

            }


        </Grid>


    );

}