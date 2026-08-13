import {
    Paper,
    Box,
    Typography,
    Chip,
    Button
} from "@mui/material";


import {
    MedicalServices,
    AccessTime,
    CalendarMonth,
    AttachMoney,
    ArrowForward
} from "@mui/icons-material";



export default function TreatmentCard({treatment}){



const statusColor = {

    Completed:"#16a34a",

    "In Progress":"#f59e0b",

    Pending:"#ef4444"

};




return (



<Paper


sx={{


width:"100%",


height:420,


p:3,


borderRadius:4,


background:"#fff",


border:"1px solid #eee3c5",


display:"flex",


flexDirection:"column",


justifyContent:"space-between",



transition:"0.25s",



"&:hover":{


transform:"translateY(-4px)",


boxShadow:"0 10px 25px rgba(0,0,0,.1)"


}



}}



>








{/* HEADER */}



<Box>


<Box

display="flex"

alignItems="center"

justifyContent="space-between"

>


<Box


sx={{


width:55,


height:55,


borderRadius:"50%",


background:"#faf7ed",


display:"flex",


alignItems:"center",


justifyContent:"center"


}}


>


<MedicalServices

sx={{

color:"#C9A227"

}}

/>


</Box>






<Chip


label={treatment.status}


size="small"


sx={{


background:

statusColor[treatment.status],


color:"#fff",


fontWeight:700


}}



/>



</Box>









<Typography

fontSize={19}

fontWeight={800}

color="#092c57"

mt={2}

>

{treatment.patient}

</Typography>




<Typography

fontSize={14}

color="#718096"

>

{treatment.treatment}

</Typography>



</Box>









{/* DETAILS */}



<Box mt={2}>




<Box

display="flex"

gap={1}

alignItems="center"

mb={1}

>


<MedicalServices

fontSize="small"

sx={{color:"#C9A227"}}

/>



<Typography

fontSize={14}

>

Tooth: <b>{treatment.tooth}</b>

</Typography>



</Box>







<Box

display="flex"

gap={1}

alignItems="center"

mb={1}

>


<CalendarMonth

fontSize="small"

sx={{color:"#C9A227"}}

/>



<Typography

fontSize={14}

>

{treatment.date}

</Typography>


</Box>








<Box

display="flex"

gap={1}

alignItems="center"

mb={1}

>


<AccessTime

fontSize="small"

sx={{color:"#C9A227"}}

/>



<Typography

fontSize={14}

>

{treatment.duration}

</Typography>



</Box>








<Box

display="flex"

gap={1}

alignItems="center"

>


<AttachMoney

fontSize="small"

sx={{color:"#C9A227"}}

/>



<Typography

fontWeight={700}

color="green"

>

{treatment.price}

</Typography>



</Box>






</Box>










{/* NOTES */}



<Box


sx={{


background:"#faf8f2",


borderRadius:2,


p:1.5,


mt:2

}}

>



<Typography

fontSize={12}

color="#718096"

>

{treatment.notes}

</Typography>



</Box>









{/* BUTTON */}



<Button


fullWidth


variant="contained"


endIcon={<ArrowForward/>}


sx={{


mt:2,


background:"#C9A227",


borderRadius:3,


fontWeight:700,


"&:hover":{


background:"#b18c1f"


}


}}


>


VIEW DETAILS


</Button>







</Paper>


)


}