import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
} from "@mui/material";
 
 
import {
  WhatsApp,
  Event,
  CleaningServices,
} from "@mui/icons-material";
 
 
import {
  useNavigate
} from "react-router-dom";
 
 
import {
  useEffect,
  useState
} from "react";
 
 
 
 
 
export default function WhatsAppReminders(){
 
 
  const navigate = useNavigate();
 
 
 
  const [reminders,setReminders] = useState([]);
 
 
  const [approvedIds,setApprovedIds] = useState([]);
 
 
  const [loading,setLoading] = useState(true);
 
 
  const [error,setError] = useState("");
 
 
 
 
 
 
 
  useEffect(()=>{
 
 
    loadReminders();
 
 
  },[]);
 
 
 
 
 
 
 
 
 
  const loadReminders = async()=>{
 
 
    try{
 
 
      const token = localStorage.getItem("token");
 
 
 
      const response = await fetch(
 
        "https://localhost:7166/api/notifications/reminders",
 
        {
 
          headers:{
 
            Authorization:`Bearer ${token}`
 
          }
 
        }
 
      );
 
 
 
 
 
      if(!response.ok){
 
        throw new Error(
          "Failed to load reminders"
        );
 
      }
 
 
 
 
 
 
      const data = await response.json();
 
 
 
      console.log(
        "REMINDERS:",
        data
      );
 
 
 
      setReminders(data);
 
 
 
 
    }
 
    catch(error){
 
 
      console.log(error);
 
 
      setError(
        error.message
      );
 
 
    }
 
    finally{
 
 
      setLoading(false);
 
 
    }
 
 
  };
 
 
 
 
 
 
 
 
 
  // Doctor approves reminder
 
  const approveReminder = async(id)=>{
 
 
    try{
 
 
      const token = localStorage.getItem("token");
 
 
 
      const response = await fetch(
 
 
        `https://localhost:7166/api/notifications/${id}/approve`,
 
 
        {
 
          method:"PUT",
 
          headers:{
 
            Authorization:`Bearer ${token}`
 
          }
 
        }
 
 
      );
 
 
 
 
 
 
      if(!response.ok){
 
 
        throw new Error(
          "Approval failed"
        );
 
 
      }
 
 
 
 
 
      setApprovedIds(prev=>[
 
        ...prev,
 
        id
 
      ]);
 
 
 
 
 
    }
 
 
    catch(error){
 
 
      console.log(error);
 
 
    }
 
 
  };
 
 
 
 
 
 
 
 
 
 
  const handleReminder = (item)=>{
 
 
 
    if(item.type === "Appointment"){
 
 
      navigate(
 
        `/appointmentWhatsapp/${item.id}`
 
      );
 
 
    }
 
 
 
 
    if(item.type === "Cleaning"){
 
 
      navigate(
 
        `/cleaningWhatsapp/${item.id}`
 
      );
 
 
    }
 
 
 
  };
 
 
 
 
 
 
 
 
 
  if(loading){
 
 
    return (
 
      <Box p={4}>
 
        Loading reminders...
 
      </Box>
 
    );
 
 
  }
 
 
 
 
 
 
 
 
return (
 
<Box
 
sx={{
 
width:"100%",
 
minHeight:"100vh",
 
background:"#faf8f2",
 
p:4
 
}}
 
>
 
 
 
 
 
<Typography
 
fontSize={32}
 
fontWeight={800}
 
color="#092c57"
 
>
 
WhatsApp Reminders
 
</Typography>
 
 
 
 
 
 
 
<Typography
 
color="#8a7a55"
 
mb={4}
 
>
 
Doctor approval required before sending messages
 
</Typography>
 
 
 
 
 
 
 
{
 
error &&
 
<Typography
 
color="error"
 
mb={3}
 
>
 
{error}
 
</Typography>
 
}
 
 
 
 
 
 
 
 
{
 
reminders.length === 0
 
?
 
(
 
<Paper
 
sx={{
 
p:4,
 
borderRadius:4
 
}}
 
>
 
<Typography>
 
No pending reminders
 
</Typography>
 
</Paper>
 
)
 
 
:
 
 
reminders.map((item)=>(
 
 
 
<Paper
 
key={item.id}
 
sx={{
 
p:3,
 
mb:3,
 
borderRadius:4,
 
border:"1px solid #eee3c5",
 
background:"#fff"
 
}}
 
>
 
 
 
 
 
 
 
<Box
 
display="flex"
 
justifyContent="space-between"
 
alignItems="center"
 
>
 
 
 
 
 
 
<Box
 
display="flex"
 
gap={2}
 
alignItems="center"
 
>
 
 
 
 
 
{
 
item.type === "Appointment"
 
?
 
<Event
 
sx={{
 
color:"#C9A227",
 
fontSize:35
 
}}
 
/>
 
 
:
 
<CleaningServices
 
sx={{
 
color:"#C9A227",
 
fontSize:35
 
}}
 
/>
 
 
}
 
 
 
 
 
 
 
 
<Box>
 
 
<Typography
 
fontSize={18}
 
fontWeight={800}
 
>
 
{item.patientName}
 
</Typography>
 
 
 
 
 
<Typography
 
color="text.secondary"
 
>
 
{item.message}
 
</Typography>
 
 
 
 
 
</Box>
 
 
 
 
 
 
</Box>
 
 
 
 
 
 
 
 
 
<Chip
 
label={
 
approvedIds.includes(item.id)
 
?
 
"Approved"
 
:
 
"Waiting Approval"
 
}
 
 
color={
 
approvedIds.includes(item.id)
 
?
 
"success"
 
:
 
"warning"
 
}
 
 
/>
 
 
 
 
 
 
 
</Box>
 
 
 
 
 
 
 
 
 
{
 
approvedIds.includes(item.id)
 
?
 
(
 
 
<Button
 
variant="contained"
 
startIcon={<WhatsApp/>}
 
onClick={()=>handleReminder(item)}
 
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
 
 
)
 
:
 
 
(
 
 
<Button
 
variant="contained"
 
onClick={()=>approveReminder(item.id)}
 
sx={{
 
mt:3,
 
background:"#C9A227",
 
fontWeight:700,
 
 
"&:hover":{
 
background:"#b18c1f"
 
}
 
}}
 
>
 
Approve Reminder
 
</Button>
 
 
)
 
}
 
 
 
 
 
<Button
 
sx={{
 
mt:3,
 
ml:2,
 
color:"#718096"
 
}}
 
>
 
Later
 
</Button>
 
 
 
 
 
 
 
</Paper>
 
 
 
))
 
}
 
 
 
 
 
 
 
</Box>
 
 
);
 
 
}