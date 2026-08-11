import {
    Box,
    Typography,
    Button
} from "@mui/material";


const conditions = [
    {
        name:"healthy",
        label:"Healthy",
        color:"#dcfce7"
    },

    {
        name:"caries",
        label:"Caries",
        color:"#d6b08c"
    },

    {
        name:"filling",
        label:"Filling",
        color:"#93c5fd"
    },

    {
        name:"crown",
        label:"Crown",
        color:"#fde68a"
    },

    {
        name:"implant",
        label:"Implant",
        color:"#60a5fa"
    },

    {
        name:"missing",
        label:"Missing",
        color:"#e5e7eb"
    }
];



export default function ToothPanel({
    tooth,
    condition,
    setCondition
}){


if(!tooth)
    return null;



return (


<Box

sx={{

mt:3,

p:2,

border:"1px solid #eee3c5",

borderRadius:3,

background:"#faf8f2"

}}

>


<Typography

fontWeight={800}

color="#092c57"

mb={2}

>

Tooth {tooth}

</Typography>




<Box

display="flex"

gap={1}

flexWrap="wrap"

>


{
conditions.map(item=>(


<Button


key={item.name}


onClick={()=>setCondition(item.name)}


sx={{


background:item.color,


color:"#092c57",


fontSize:12,


fontWeight:700


}}



>

{item.label}

</Button>


))

}



</Box>


</Box>


)

}