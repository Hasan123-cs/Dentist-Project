import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
} from "@mui/material";

import {
    Home,
    CalendarMonth,
    People,
    MedicalServices,
    Settings,
    Logout,
} from "@mui/icons-material";

import {
    useNavigate,
    useLocation
} from "react-router-dom";


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
        name: "Settings",
        icon: <Settings />,
        path: "/settings"
    }

];


export default function Sidebar(){

    const navigate = useNavigate();

    const location = useLocation();


    return (

        <Box

            sx={{

                width:280,

                height:"100vh",

                position:"fixed",

                left:0,

                top:0,

                zIndex:1200,

                background:"#ffffff",

                borderRight:"1px solid #eee3c5",

                p:3,

                boxSizing:"border-box",

                display:"flex",

                flexDirection:"column"

            }}

        >


            {/* LOGO */}

            <Box

                sx={{

                    display:"flex",

                    alignItems:"center",

                    gap:2,

                    mb:4

                }}

            >

                <Box

                    sx={{

                        width:45,

                        height:45,

                        borderRadius:3,

                        background:"#F8F0D8",

                        display:"flex",

                        alignItems:"center",

                        justifyContent:"center",

                        fontSize:25

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



            {/* DOCTOR CARD */}


            <Box

                sx={{

                    background:"#faf7ed",

                    borderRadius:4,

                    p:2,

                    mb:3,

                    display:"flex",

                    alignItems:"center",

                    gap:2

                }}

            >

                <Avatar

                    src="https://randomuser.me/api/portraits/men/32.jpg"

                    sx={{

                        width:55,

                        height:55

                    }}

                />


                <Box>

                    <Typography

                        fontWeight={700}

                        color="#3d2f12"

                    >

                        Dr. David

                    </Typography>


                    <Typography

                        fontSize={13}

                        color="text.secondary"

                    >

                        Dentist

                    </Typography>

                </Box>


            </Box>



            {/* MENU */}


            <List

                sx={{

                    flex:1,

                    mt:2

                }}

            >

                {

                    menu.map((item)=>{


                        const active = 
                        location.pathname.startsWith(item.path);



                        return (

                            <ListItemButton

                                key={item.name}

                                onClick={()=>navigate(item.path)}

                                sx={{

                                    height:48,

                                    borderRadius:3,

                                    mb:1,


                                    background:

                                    active

                                    ?

                                    "#C9A227"

                                    :

                                    "transparent",


                                    color:

                                    active

                                    ?

                                    "#ffffff"

                                    :

                                    "#52677e",



                                    "&:hover":{

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

                                        minWidth:40,

                                        color:

                                        active

                                        ?

                                        "#ffffff"

                                        :

                                        "#8a7a55"

                                    }}

                                >

                                    {item.icon}

                                </ListItemIcon>



                                <ListItemText

                                    primary={item.name}

                                    primaryTypographyProps={{

                                        fontWeight:

                                        active

                                        ?

                                        700

                                        :

                                        500

                                    }}

                                />


                            </ListItemButton>

                        )


                    })

                }


            </List>



            {/* LOGOUT */}


            <ListItemButton

                sx={{

                    borderRadius:3,

                    color:"#d32f2f"

                }}

            >

                <ListItemIcon

                    sx={{

                        minWidth:40,

                        color:"#d32f2f"

                    }}

                >

                    <Logout />

                </ListItemIcon>


                <ListItemText

                    primary="Logout"

                />


            </ListItemButton>


        </Box>

    );

}