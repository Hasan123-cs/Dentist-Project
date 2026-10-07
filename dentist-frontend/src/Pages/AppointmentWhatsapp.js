import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";
 
 
import {
  WhatsApp,
} from "@mui/icons-material";
 
 
import {
  useParams
} from "react-router-dom";
 
 
import {
  useEffect,
  useState
} from "react";
 
 
import dayjs from "dayjs";
 
 
 
 
 
export default function AppointmentWhatsapp(){
 
 
  const { id } = useParams();
 
 
 
  const [appointment,setAppointment] = useState(null);
 
 
  const [loading,setLoading] = useState(true);
 
 
 
 
 
 
 
  useEffect(()=>{
 
 
    const loadAppointment = async()=>{
 
 
      try{
 
 
        const token = localStorage.getItem("token");
 
 
 
        const response = await fetch(
 
          `https://localhost:7166/api/appointments/${id}`,
 
          {
 
            headers:{
 
              Authorization:`Bearer ${token}`
 
            }
 
          }
 
        );
 
 
 
 
 
        if(!response.ok){
 
          throw new Error(
            "Appointment not found"
          );
 
        }
 
 
 
 
 
        const data = await response.json();
 
 
 
        console.log(
          "Appointment WhatsApp:",
          data
        );
 
 
 
        setAppointment(data);
 
 
 
      }
 
 
      catch(error){
 
 
        console.log(error);
 
 
      }
 
 
      finally{
 
 
        setLoading(false);
 
 
      }
 
 
    };
 
 
 
    loadAppointment();
 
 
 
  },[id]);
 
 
 
 
 
 
 
 
 
  if(loading){
 
 
    return (
 
      <Box p={4}>
 
        Loading appointment...
 
      </Box>
 
    );
 
 
  }
 
 
 
 
 
 
 
  if(!appointment){
 
 
    return (
 
      <Box p={4}>
 
        Appointment not found
 
      </Box>
 
    );
 
 
  }
 
 
 
 
 
 
 
  const patientName =
 
    `${appointment.patient.firstName} ${appointment.patient.lastName}`;
 
 
 
  const date =
 
    dayjs(
      appointment.startDateTime
    )
 
    .format(
      "DD MMMM YYYY"
    );
 
 
 
  const time =
 
    dayjs(
      appointment.startDateTime
    )
 
    .format(
      "hh:mm A"
    );
 
 
 
 
 
 
 
 
  const message =
 
`Hello ${patientName},
 
This is a reminder for your dental appointment.
 
Appointment Date:
${date}
 
Appointment Time:
${time}
 
We are waiting for you.
 
Thank you.`;
 
 
 
 
 
 
 
 
 
const openWhatsApp = ()=>{
 
 
  let phone = appointment.patient.phone;
 
 
 
  // remove spaces and symbols
 
  phone = phone
    .replace(/\s+/g,"")
    .replace("+","");
 
 
 
 
  const encodedMessage =
 
    encodeURIComponent(message);
 
 
 
 
 
  const whatsappUrl =
 
    `https://wa.me/${phone}?text=${encodedMessage}`;
 
 
 
 
 
  window.open(
    whatsappUrl,
    "_blank"
  );
 
 
};
 
 
 
 
 
 
 
 
 
return (
 
<Box
 
sx={{
 
width:"100%",
 
minHeight:"100vh",
 
background:"#faf8f2",
 
p:4
 
}}
 
>
 
 
 
 
<Paper
 
sx={{
 
maxWidth:700,
 
mx:"auto",
 
p:4,
 
borderRadius:4,
 
background:"#fff",
 
border:"1px solid #eee3c5"
 
}}
 
>
 
 
 
 
 
<Typography
 
fontSize={28}
 
fontWeight={800}
 
color="#092c57"
 
textAlign="center"
 
>
 
WhatsApp Reminder
 
</Typography>
 
 
 
 
 
 
<Typography
 
textAlign="center"
 
color="#8a7a55"
 
mt={1}
 
>
 
Review message before sending
 
</Typography>
 
 
 
 
 
 
 
 
 
<Box
 
sx={{
 
mt:4,
 
p:3,
 
background:"#f5f5f5",
 
borderRadius:3,
 
whiteSpace:"pre-line"
 
}}
 
>
 
 
<Typography>
 
{message}
 
</Typography>
 
 
</Box>
 
 
 
 
 
 
 
<Button
 
fullWidth
 
variant="contained"
 
startIcon={<WhatsApp />}
 
onClick={openWhatsApp}
 
sx={{
 
mt:3,
 
background:"#25D366",
 
fontWeight:700,
 
 
"&:hover":{
 
background:"#1da851"
 
}
 
}}
 
>
 
Open WhatsApp
 
</Button>
 
 
 
 
 
 
 
</Paper>
 
 
 
 
 
</Box>
 
 
);
 
 
}