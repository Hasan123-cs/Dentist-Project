import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";

import {
  Home,
  CalendarMonth,
  People,
  MedicalServices,
  Settings,
  Logout,
} from "@mui/icons-material";


const menu = [
  {
    name: "Dashboard",
    icon: <Home />,
  },
  {
    name: "Appointments",
    icon: <CalendarMonth />,
  },
  {
    name: "Patients",
    icon: <People />,
  },
  {
    name: "Treatments",
    icon: <MedicalServices />,
  },
  {
    name: "Settings",
    icon: <Settings />,
  },
];


export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: "#ffffff",
        borderRight: "1px solid #e4edf5",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* Logo */}

      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Box
          sx={{
            width: 45,
            height: 45,
            borderRadius: 3,
            background: "#eaf3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
          }}
        >
          🦷
        </Box>


        <Box>
          <Typography
            fontSize={22}
            fontWeight={800}
            color="#092c57"
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


      {/* Doctor Profile */}

      <Box
        sx={{
          background: "#f5f9ff",
          borderRadius: 4,
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >

        <Avatar
          src="https://randomuser.me/api/portraits/men/32.jpg"
          sx={{
            width: 55,
            height: 55,
          }}
        />


        <Box>
          <Typography
            fontWeight={700}
            color="#092c57"
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


      <Divider />


      {/* Menu */}

      <List
        sx={{
          mt: 2,
          flex: 1,
        }}
      >

        {menu.map((item, index) => (

          <ListItemButton
            key={item.name}
            sx={{
              borderRadius: 3,
              mb: 1,
              height: 48,

              background:
                index === 0
                  ? "#eaf3ff"
                  : "transparent",

              color:
                index === 0
                  ? "#0755a0"
                  : "#52677e",


              "&:hover": {
                background: "#f5f9ff",
              },
            }}
          >

            <ListItemIcon
              sx={{
                minWidth: 40,
                color:
                  index === 0
                    ? "#0755a0"
                    : "#657786",
              }}
            >
              {item.icon}
            </ListItemIcon>


            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight:
                  index === 0
                    ? 700
                    : 500,
              }}
            />

          </ListItemButton>

        ))}

      </List>



      {/* Logout */}

      <ListItemButton
        sx={{
          borderRadius: 3,
          color: "#d32f2f",
        }}
      >

        <ListItemIcon
          sx={{
            color: "#d32f2f",
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