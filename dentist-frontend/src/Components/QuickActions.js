import { Grid, Paper, Typography, Box } from "@mui/material";
import { PersonAdd, CalendarMonth } from "@mui/icons-material";
import { Link } from "react-router-dom";

const actions = [
    ["Add Patient", PersonAdd, "/Patients/AddPatient"],
    ["Schedule Appointment", CalendarMonth, "/Schedule"],
];

export default function QuickActions() {

    return (

        <Grid
            container
            spacing={5}
            mt={5}
            sx={{
                p: 3,
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            {
                actions.map(([name, Icon, route]) => (

                    <Grid
                        item
                        xs="auto"
                        key={name}
                    >

                        <Link
                            to={route}
                            style={{
                                textDecoration: "none"
                            }}
                        >

                            <Paper

                                sx={{

                                    width: 250,
                                    height: 150,

                                    borderRadius: 3,

                                    display: "flex",

                                    flexDirection: "column",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    gap: 1.5,

                                    border: "1px solid #e2eaf3",

                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

                                    cursor: "pointer",

                                    transition: "0.3s",

                                    "&:hover": {

                                        background: "#f8fbff",

                                        borderColor: "#1976d2",

                                        transform: "translateY(-3px)"

                                    }

                                }}

                            >


                                <Box

                                    sx={{

                                        width: 55,

                                        height: 55,

                                        borderRadius: "50%",

                                        background: "#eaf3ff",

                                        display: "flex",

                                        alignItems: "center",

                                        justifyContent: "center"

                                    }}

                                >

                                    <Icon

                                        sx={{

                                            color: "#C9A227",

                                            fontSize: 28

                                        }}

                                    />

                                </Box>



                                <Typography

                                    sx={{

                                        fontSize: 13,

                                        fontWeight: 600,

                                        color: "#092c57",

                                        textAlign: "center",

                                        whiteSpace: "nowrap"

                                    }}

                                >

                                    {name}

                                </Typography>


                            </Paper>


                        </Link>


                    </Grid>

                ))
            }


        </Grid>

    );
}