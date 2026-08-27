import {
    Box,
    Typography,
    Button
} from "@mui/material";


import {
    Add
} from "@mui/icons-material";


import {
    useNavigate
} from "react-router-dom";



export default function PatientHeader(){


const navigate = useNavigate();



return (


<Box

sx={{

    width:"100%",

    display:"flex",

    justifyContent:"space-between",

    alignItems:"center",

    mb:3,

    gap:2,

    flexWrap:"wrap"

}}

>





<Box>


<Typography

fontSize={32}

fontWeight={800}

color="#092c57"

>

Patients

</Typography>





<Typography

fontSize={15}

color="#718096"

mt={0.5}

>

Manage your patient database

</Typography>


</Box>









<Box

display="flex"

gap={2}

flexWrap="wrap"

>


<Button


variant="contained"


startIcon={<Add />}



onClick={()=>navigate("/patients/add")}



sx={{


height:42,


borderRadius:3,


background:"#C9A227",


color:"#fff",


fontWeight:700,



"&:hover":{


background:"#b18c1f"


}


}}



>


Add Patient


</Button>





</Box>





</Box>



);


}