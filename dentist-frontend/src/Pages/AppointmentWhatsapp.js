import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
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
 
 
import { PageLoading } from "../Components/PageState";
import { formatLebanonDateTime } from "../utils/dateTime";
import { createWhatsAppUrl } from "../utils/whatsapp";
 
 
 
 
 
export default function AppointmentWhatsapp(){
 
 
  const { id } = useParams();
 
 
 
  const [appointment,setAppointment] = useState(null);
 
 
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
 
 
 
 
 
 
 
  useEffect(()=>{
 
 
    const loadAppointment = async()=>{
 
 
      try{
 
 
        const token = localStorage.getItem("token");
 
 
 
        const response = await fetch(
 
          `${process.env.REACT_APP_API_URL}/api/appointments/${id}`,
 
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
    return <PageLoading label="Loading appointment..." />;
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
 
 
 
  const date = formatLebanonDateTime(
    appointment.startDateTime,
    "DD MMMM YYYY"
  );
 
 
 
  const time = formatLebanonDateTime(
    appointment.startDateTime,
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
 
 
  const whatsappUrl = createWhatsAppUrl(
    appointment.patient.phone,
    message
  );
  if (!whatsappUrl) {
    setError("Patient phone number not found.");
    return;
  }
 
 
 
 
 
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

{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
 
 
 
 
 
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