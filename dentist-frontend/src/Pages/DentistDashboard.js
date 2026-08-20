import { Box, Grid } from "@mui/material";


import Header from "../Components/Header";
import StatCard from "../Components/StatsCard";
import QuickActions from "../Components/QuickActions";
import Schedule from "../Components/Schedule";
import Analytics from "../Components/Analytics";


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {
    CalendarMonth,
    AttachMoney,
    People,
    Warning,
} from "@mui/icons-material";



export default function DentistDashboard(){


    const navigate = useNavigate();


    const [dashboardData,setDashboardData] = useState(null);

    const [loading,setLoading] = useState(true);



    const token = localStorage.getItem("token");





    useEffect(()=>{


        const fetchDashboardData = async()=>{


            try{


                const response = await fetch(

                    "https://localhost:7166/api/dashboard",

                    {

                        headers:{

                            Authorization:`Bearer ${token}`

                        }

                    }

                );



                if(!response.ok){


                    const errorText = await response.text();

                    console.log(errorText);

                    return;

                }





                const data = await response.json();


                console.log(data);


                setDashboardData(data);



            }

            catch(error){


                navigate(
                    "/error?message=" +
                    encodeURIComponent(error.message)
                );


            }

            finally{

                setLoading(false);

            }


        };



        fetchDashboardData();



    },[navigate,token]);







    if(loading){


        return (

            <Box

                p={4}

                color="#092c57"

            >

                Loading Dashboard...


            </Box>

        );


    }







    return (


        <Box


            sx={{


                width:"100%",


                background:"#f7fbff",


                boxSizing:"border-box",


                overflow:"hidden"


            }}



        >






            {/* HEADER */}


            <Header

                dashboardData={dashboardData}

            />









            {/* STAT CARDS */}



            <Grid


                container


                spacing={3}


                mt={3}


                sx={{


                    width:"100%",


                    marginLeft:0


                }}



            >





                <Grid

                    item

                    xs={12}

                    sm={6}

                    lg={3}

                >


                    <StatCard


                        icon={<CalendarMonth />}


                        title="Today's Appointments"


                        value={

                            dashboardData?.todaysAppointments || 0

                        }


                        description={

                            `${dashboardData?.confirmedAppointments || 0} confirmed ${
                                dashboardData?.pendingAppointments || 0
                            } pending`

                        }


                    />


                </Grid>








                <Grid

                    item

                    xs={12}

                    sm={6}

                    lg={3}

                >


                    <StatCard


                        icon={<AttachMoney />}


                        title="Weekly Revenue"


                        value={

                            dashboardData?.weeklyRevenue || 0

                        }


                        description="vs last week"


                    />


                </Grid>









                <Grid

                    item

                    xs={12}

                    sm={6}

                    lg={3}

                >


                    <StatCard


                        icon={<People />}


                        title="Total Patients"


                        value={

                            dashboardData?.totalPatients || 0

                        }


                        description={

                            `${dashboardData?.newPatientsMonth || 0} new this month`

                        }


                    />


                </Grid>









                <Grid

                    item

                    xs={12}

                    sm={6}

                    lg={3}

                >


                    <StatCard


                        icon={<Warning />}


                        title="Outstanding Balance"


                        value={

                            dashboardData?.outstandingBalance || 0

                        }


                        description="9 outstanding invoices"


                    />


                </Grid>




            </Grid>









            {/* QUICK ACTIONS */}



            <Box

                mt={4}

                width="100%"

            >


                <QuickActions />


            </Box>









            {/* SCHEDULE */}



            <Box

                mt={4}

                width="100%"

            >


                <Schedule


                    ScheduleList={

                        dashboardData?.schedule || []

                    }


                />


            </Box>









            {/* ANALYTICS */}



            <Box

                mt={4}

                width="100%"

            >


                <Analytics


                    analysisList={

                        dashboardData?.analytics || {}

                    }


                />


            </Box>







        </Box>


    );


}