import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";


export default function Layout(){

return (

<Box

sx={{
display:"flex",
minHeight:"100vh",
background:"#faf8f2"
}}

>


<Sidebar />



<Box

component="main"

sx={{

flex:1,

minWidth:0,

p:4,

boxSizing:"border-box",

overflowX:"hidden"

}}

>


<Outlet />


</Box>



</Box>

)

}