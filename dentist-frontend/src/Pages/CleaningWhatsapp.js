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
 
 
 
 
 
export default function CleaningWhatsapp(){
 
 
  const { id } = useParams();
 
 
 
  const [reminder,setReminder] = useState(null);
 
 
  const [loading,setLoading] = useState(true);
 
 
 
 
 
 
  useEffect(()=>{
 
 
    const loadReminder = async()=>{
 
 
      try{
 
 
        const token = localStorage.getItem("token");
 
 
 
        const response = await fetch(
 
          `https://localhost:7166/api/recallreminders/${id}`,
 
          {
 
            headers:{
 
              Authorization:`Bearer ${token}`
 
            }
 
          }
 
        );
 
 
 
 
 
        if(!response.ok){
 
          throw new Error(
            "Reminder not found"
          );
 
        }
 
 
 
 
        const data = await response.json();
 
 
 
        console.log(
          "Cleaning reminder:",
          data
        );
 
 
 
        setReminder(data);
 
 
 
      }
 
 
      catch(error){
 
        console.log(error);
 
      }
 
 
      finally{
 
        setLoading(false);
 
      }
 
 
 
    };
 
 
 
    loadReminder();
 
 
 
  },[id]);
 
 
 
 
 
 
 
 
 
  if(loading){
 
    return (
 
      <Box p={4}>
 
        Loading reminder...
 
      </Box>
 
    );
 
  }
 
 
 
 
 
 
 
  if(!reminder){
 
    return (
 
      <Box p={4}>
 
        Reminder not found
 
      </Box>
 
    );
 
  }
 
 
 
 
 
 
 
 
  const patientName =
 
    `${reminder.patient.firstName} ${reminder.patient.lastName}`;
 
 
 
 
 
  const lastCleaning =
 
    dayjs(
      reminder.lastVisitDate
    )
    .format(
      "DD MMMM YYYY"
    );
 
 
 
 
 
 
const message =
 
`Hello ${patientName},
 
We hope you are doing well.
 
It has been 6 months since your last dental cleaning.
 
Your last cleaning was:
${lastCleaning}
 
We would like to remind you to schedule your next cleaning appointment.
 
Thank you.`;
 
 
 
 
 
 
 
const openWhatsApp = ()=>{
 
 
  let phone =
    reminder.patient.phone;
 
 
 
  phone = phone
    .replace(/\s+/g,"")
    .replace("+","");
 
 
 
 
  const url =
 
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
 
 
 
 
 
  window.open(
    url,
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
 
Cleaning Reminder
 
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
 
fontWeight:700
 
}}
 
>
 
Open WhatsApp
 
</Button>
 
 
 
 
 
 
</Paper>
 
 
 
 
 
</Box>
 
 
);
 
 
}