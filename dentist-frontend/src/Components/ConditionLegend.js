import {
    Box,
    Typography
} from "@mui/material";



const conditions = [

    {
        label:"Healthy",
        color:"#dcfce7"
    },

    {
        label:"Filling",
        color:"#93c5fd"
    },

    {
        label:"Crown",
        color:"#fde68a"
    },

    {
        label:"Missing",
        color:"#e5e7eb"
    },

    {
        label:"Implant",
        color:"#60a5fa"
    },

    {
        label:"Root Canal",
        color:"#c084fc"
    },

    {
        label:"Bridge",
        color:"#fb923c"
    }

];





export default function ConditionLegend(){



return (


<Box

sx={{

mt:3,

p:2,

border:"1px solid #eee3c5",

borderRadius:3,

background:"#fff"

}}

>



<Typography

fontWeight={800}

color="#092c57"

mb={2}

>

Condition Legend

</Typography>






<Box

display="flex"

flexWrap="wrap"

gap={2}

>


{

conditions.map(item=>(


<Box

key={item.label}

display="flex"

alignItems="center"

gap={1}

>


<Box

sx={{

width:16,

height:16,

borderRadius:1,

background:item.color,

border:"1px solid #ccc"

}}

/>





<Typography

fontSize={13}

color="#092c57"

>

{item.label}

</Typography>



</Box>


))

}



</Box>






</Box>


)


}