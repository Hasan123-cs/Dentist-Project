import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";


export default function MainLayout(){

    return (

        <Box
            sx={{
                display:"flex",
                width:"100%",
                minHeight:"100vh",
                background:"#faf8f2"
            }}
        >

            <Sidebar />


            <Box
                component="main"
                sx={{
                    flexGrow:1,
                    width:"calc(100% - 280px)",
                    minWidth:0,
                    p:4,
                    boxSizing:"border-box",
                    background:"#f7fbff"
                }}
            >

                <Outlet />

            </Box>


        </Box>

    );
}