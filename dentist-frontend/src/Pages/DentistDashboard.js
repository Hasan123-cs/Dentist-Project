import {
    Box,
    Grid
} from "@mui/material";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import StatCard from "../Components/StatsCard";
import QuickActions from "../Components/QuickActions";
import Schedule from "../Components/Schedule";
import Analytics from "../Components/Analytics";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    CalendarMonth,
    AttachMoney,
    People,
    Warning,
} from "@mui/icons-material";


export default function DentistDashboard() {

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");


    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const response = await fetch(
                    "https://localhost:7166/api/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );


                if (!response.ok) {

                    const errorText = await response.text();

                    console.log(errorText);

                    return;
                }


                const data = await response.json();

                console.log(data);

                setDashboardData(data);


            } catch (error) {

                navigate(
                    "/error?message=" +
                    encodeURIComponent(error.message)
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboardData();

    }, [navigate, token]);


    return (

        <Box
            sx={{
                display: "flex",
                background: "#f7fbff",
                minHeight: "100vh",
            }}
        >

            {/* SIDEBAR */}

            <Sidebar />


            {/* MAIN CONTENT */}

            <Box
                component="main"
                sx={{
                    ml: "280px",
                    width: "calc(100% - 280px)",
                    minHeight: "100vh",
                    p: 4,
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}
            >

                {/* HEADER */}

                <Header
                    dashboardData={dashboardData}
                />


                {/* STAT CARDS */}

                <Grid
                    container
                    spacing={5}
                    mt={2}
                    sx={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
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


                    <StatCard
                        icon={<AttachMoney />}
                        title="Weekly Revenue"
                        value={
                            dashboardData?.weeklyRevenue || 0
                        }
                        description="vs last week"
                    />


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


                    <StatCard
                        icon={<Warning />}
                        title="Outstanding Balance"
                        value={
                            dashboardData?.outstandingBalance || 0
                        }
                        description="9 outstanding invoices"
                    />

                </Grid>


                {/* QUICK ACTIONS */}

                <QuickActions />


                {/* TODAY'S SCHEDULE */}

                <Schedule
                    ScheduleList={
                        dashboardData?.schedule || []
                    }
                />


                {/* ANALYTICS */}

                <Analytics
                    analysisList={
                        dashboardData?.analytics || {}
                    }
                />

            </Box>

        </Box>

    );
}