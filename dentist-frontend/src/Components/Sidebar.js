import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Drawer
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";


import {
    Home,
    CalendarMonth,
    People,
    MedicalServices,
    Logout,
    Chat
} from "@mui/icons-material";


import {
    useNavigate,
    useLocation
} from "react-router-dom";


import amanyImage from "../images/Amany.jpeg";



const menu = [

    {
        name: "Dashboard",
        icon: <Home />,
        path: "/dashboard"
    },

    {
        name: "Appointments",
        icon: <CalendarMonth />,
        path: "/appointments"
    },

    {
        name: "Patients",
        icon: <People />,
        path: "/patients"
    },

    {
        name: "Treatments",
        icon: <MedicalServices />,
        path: "/treatments"
    },

    {
        name: "WhatsApp",
        icon: <Chat />,
        path: "/whatsapp"
    },



];



export default function Sidebar({ open, onClose }) {


    const navigate = useNavigate();

    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:899px)");

    const handleLogout = () => {
        localStorage.removeItem("token");
        onClose?.();
        navigate("/login", { replace: true });
    };

    const token = localStorage.getItem("token");


    let isAssistant = false;



    if (token) {

        const payload = JSON.parse(
            atob(token.split(".")[1])
        );


        const role =
            payload[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];


        console.log("SIDEBAR ROLE:", role);


        isAssistant = role === "Assistant";

    }




    const userName = isAssistant
        ? "Assistant"
        : "Dr. Amany Nseif";




    const sidebar = (
        <Box
            component="nav"
            aria-label="Main navigation"

            sx={{

                width: isMobile ? "min(280px, 85vw)" : 280,

                minWidth: isMobile ? "min(280px, 85vw)" : 280,

                flexShrink: 0,

                height: isMobile ? "100dvh" : "100vh",
                overflowY: "auto",

                background: "#ffffff",

                borderRight: "1px solid #eee3c5",

                p: 3,

                boxSizing: "border-box",

                display: "flex",

                flexDirection: "column",

                position: isMobile ? "static" : "sticky",

                top: 0,

            }}

        >



            {/* LOGO */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4
                }}
            >

                <Box
                    sx={{
                        width: 45,
                        height: 45,
                        borderRadius: 3,
                        background: "#F8F0D8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 25
                    }}
                >

                    🦷

                </Box>


                <Box>

                    <Typography
                        fontSize={20}
                        fontWeight={800}
                        color="#C9A227"
                    >
                        DentalCare
                    </Typography>


                    <Typography
                        fontSize={12}
                        color="text.secondary"
                    >
                        Clinic Management
                    </Typography>

                </Box>

            </Box>






            {/* USER PROFILE */}

            <Box

                sx={{

                    background: "#faf7ed",

                    borderRadius: 4,

                    p: 2,

                    mb: 3,

                    display: "flex",

                    alignItems: "center",

                    gap: 2

                }}

            >


                {!isAssistant && (

                    <Avatar

                        src={amanyImage}

                        sx={{

                            width: 55,

                            height: 55

                        }}

                    />

                )}



                <Box>


                    <Typography fontWeight={700}>

                        {userName}

                    </Typography>



                    {!isAssistant && (

                        <Typography

                            fontSize={13}

                            color="text.secondary"

                        >

                            Dentist

                        </Typography>

                    )}



                </Box>


            </Box>








            {/* MENU */}


            <List sx={{ flex: 1 }}>


                {
                    menu.map((item) => {


                        const active =
                            location.pathname.startsWith(item.path);



                        return (

                            <ListItemButton

                                key={item.name}

                                onClick={() => {
                                    navigate(item.path);
                                    onClose?.();
                                }}

                                sx={{

                                    height: 48,

                                    borderRadius: 3,

                                    mb: 1,


                                    background:

                                        active

                                            ?

                                            "#C9A227"

                                            :

                                            "transparent",



                                    color:

                                        active

                                            ?

                                            "#fff"

                                            :

                                            "#52677e",



                                    "&:hover": {

                                        background:

                                            active

                                                ?

                                                "#C9A227"

                                                :

                                                "#faf7ed"

                                    }

                                }}

                            >


                                <ListItemIcon

                                    sx={{

                                        minWidth: 40,

                                        color:

                                            active

                                                ?

                                                "#fff"

                                                :

                                                "#8a7a55"

                                    }}

                                >

                                    {item.icon}

                                </ListItemIcon>



                                <ListItemText

                                    primary={item.name}

                                />


                            </ListItemButton>

                        );


                    })

                }


            </List>








            {/* LOGOUT */}


            <ListItemButton
                onClick={handleLogout}
                sx={{
                    borderRadius: 3,
                    color: "#d32f2f"
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 40,
                        color: "#d32f2f"
                    }}
                >
                    <Logout />
                </ListItemIcon>

                <ListItemText primary="Logout" />
            </ListItemButton>



        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                PaperProps={{ sx: { width: "min(280px, 85vw)", maxWidth: "85vw" } }}
            >
                {sidebar}
            </Drawer>
        );
    }

    return sidebar;
}