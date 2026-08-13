import {
    Box,
    Typography,
    Button
} from "@mui/material";


export default function TreatmentHeader(){



return (


<Box

sx={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

mb:4

}}

>



<Box>


<Typography

fontSize={32}

fontWeight={800}

color="#092c57"

>

Treatments

</Typography>




<Typography

fontSize={15}

color="#718096"

mt={1}

>

Manage and track patient dental treatments

</Typography>


</Box>







<Button

variant="contained"

sx={{


background:"#C9A227",


borderRadius:3,


px:3,


py:1.2,


fontWeight:700,


"&:hover":{

background:"#b18c1f"

}


}}

>

+ ADD TREATMENT

</Button>





</Box>


)


}