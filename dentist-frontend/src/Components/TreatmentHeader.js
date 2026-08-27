import {
    Box,
    Typography
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



</Box>

);

}