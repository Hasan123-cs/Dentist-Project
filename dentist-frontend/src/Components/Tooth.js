import {
    Box,
    Typography
} from "@mui/material";



const conditions = {

    healthy:"#dcfce7",

    caries:"#d6b08c",

    filling:"#93c5fd",

    crown:"#fde68a",

    implant:"#60a5fa",

    missing:"#e5e7eb"

};





export default function Tooth({
    number,
    condition="healthy",
    onClick
}){



return (


<Box

onClick={onClick}

sx={{

display:"flex",

flexDirection:"column",

alignItems:"center",

cursor:"pointer",

transition:"0.2s",


"&:hover":{

transform:"translateY(-4px)"

}


}}

>





<Typography

fontSize={11}

fontWeight={600}

color="#092c57"

mb={0.5}

>

{number}

</Typography>








{/* Tooth */}

<Box

sx={{


width:38,

height:55,


position:"relative",


display:"flex",

justifyContent:"center"

}}

>





{/* Crown */}


<Box

sx={{


width:34,

height:38,


background:
conditions[condition],



border:"1px solid #cbd5e1",



borderRadius:

"14px 14px 10px 10px",



position:"absolute",



top:0,



boxShadow:
"0 2px 4px rgba(0,0,0,.08)"

}}


/>









{/* Root */}


<Box

sx={{


position:"absolute",



bottom:0,



width:12,



height:18,



background:"#f1d7ad",



borderRadius:
"0 0 8px 8px",



border:"1px solid #d6b58a"


}}


/>







</Box>





</Box>


)


}