import {Box} from "@mui/material";


const colors={

healthy:"#e8f7ee",

caries:"#e53935",

filling:"#42a5f5",

crown:"#fdd835",

missing:"#bdbdbd",

rootCanal:"#8e24aa",

implant:"#8e7dff",

bridge:"#ffb15c"

};




export default function ToothCircle({

condition={},

onSurfaceClick

}){


const color=(s)=>

colors[condition[s] || "healthy"];



return (

<Box

sx={{

width:38,

height:38,

borderRadius:"50%",

border:"1.5px solid #666",

overflow:"hidden",

display:"grid",

gridTemplateColumns:"1fr 1fr 1fr",

gridTemplateRows:"1fr 1fr 1fr",

background:"#fff"

}}

>





{/* Buccal */}

<Box

onClick={(e)=>{

e.stopPropagation();

onSurfaceClick("B")

}}

sx={{

gridColumn:2,

gridRow:1,

background:color("B"),

borderBottom:"1px solid #777"

}}

/>






{/* Mesial */}

<Box

onClick={(e)=>{

e.stopPropagation();

onSurfaceClick("M")

}}

sx={{

gridColumn:1,

gridRow:2,

background:color("M"),

borderRight:"1px solid #777"

}}

/>






{/* Occlusal */}

<Box

onClick={(e)=>{

e.stopPropagation();

onSurfaceClick("O")

}}

sx={{

gridColumn:2,

gridRow:2,

background:color("O"),

borderRadius:"50%",

border:"1px solid #777",

zIndex:2

}}

/>






{/* Distal */}

<Box

onClick={(e)=>{

e.stopPropagation();

onSurfaceClick("D")

}}

sx={{

gridColumn:3,

gridRow:2,

background:color("D"),

borderLeft:"1px solid #777"

}}

/>






{/* Lingual */}

<Box

onClick={(e)=>{

e.stopPropagation();

onSurfaceClick("L")

}}

sx={{

gridColumn:2,

gridRow:3,

background:color("L"),

borderTop:"1px solid #777"

}}

/>



</Box>

)

}