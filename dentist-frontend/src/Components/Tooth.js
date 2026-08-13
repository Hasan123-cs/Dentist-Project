import { Box, Typography } from "@mui/material";
import ToothCircle from "./ToothCircle";



const molars=[
    16,17,18,
    26,27,28,
    36,37,38,
    46,47,48
];


const premolars=[
    14,15,
    24,25,
    34,35,
    44,45
];


const canines=[
    13,23,33,43
];





function getType(number){

    if(molars.includes(number))
        return "molar";


    if(premolars.includes(number))
        return "premolar";


    if(canines.includes(number))
        return "canine";


    return "incisor";

}









export default function Tooth({

    number,

    conditions={},

    selected,

    onClick,

    onSurfaceClick,

    isUpper

}){


const type=getType(number);



return (


<Box


onClick={onClick}


sx={{


width:60,

minWidth:60,

maxWidth:60,


flexShrink:0,


display:"flex",

flexDirection:"column",

alignItems:"center",


cursor:"pointer",


borderRadius:3,


background:selected

?

"rgba(201,162,39,.15)"

:

"transparent",



py:1


}}


>






<Typography

fontSize={12}

fontWeight={800}

color="#092c57"

mb={1}

>

{number}

</Typography>







<Box

sx={{

width:55,

height:120,

flexShrink:0,

transform:

isUpper

?

"none"

:

"rotate(180deg)"

}}

>


<ToothSVG

type={type}

conditions={conditions}

/>


</Box>








<Box

mt={1}

>


<ToothCircle

condition={conditions}

onSurfaceClick={onSurfaceClick}

/>


</Box>







</Box>


)

}













function ToothSVG({

type,

conditions

}){



const missing =
Object.values(conditions)
.includes("missing");


const rootCanal =
Object.values(conditions)
.includes("rootCanal");


const filling =
Object.values(conditions)
.includes("filling");


const crown =
Object.values(conditions)
.includes("crown");






if(missing){


return (

<Box

sx={{

height:"100%",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:45,

color:"#bdbdbd"

}}

>

×

</Box>

)

}





return (


<svg

width="55"

height="120"

viewBox="0 0 100 240"

>


{drawRoots(type,rootCanal)}


{drawCrown(type,crown,filling)}



</svg>


)

}









function drawRoots(type,rootCanal){



if(type==="molar"){


return (

<>


<path

d="M32 90 L20 200 Q25 220 40 195 L45 90"

fill="#edf2f5"

stroke="#9aa9b5"

/>


<path

d="M45 90 L45 205 Q50 225 55 205 L55 90"

fill="#edf2f5"

stroke="#9aa9b5"

/>



<path

d="M58 90 L75 200 Q78 220 85 195 L68 90"

fill="#edf2f5"

stroke="#9aa9b5"

/>





{

rootCanal &&

<>

<path

d="M32 110 L30 195"

stroke="#8e24aa"

strokeWidth="4"

/>


<path

d="M50 110 L50 205"

stroke="#8e24aa"

strokeWidth="4"

/>


<path

d="M68 110 L75 195"

stroke="#8e24aa"

strokeWidth="4"

/>

</>


}



</>

)

}









if(type==="premolar"){


return (

<>



<path

d="M38 90 L30 200 Q35 220 45 195 L48 90"

fill="#edf2f5"

stroke="#9aa9b5"

/>




<path

d="M52 90 L55 195 Q65 220 70 200 L62 90"

fill="#edf2f5"

stroke="#9aa9b5"

/>






{

rootCanal &&

<>

<path

d="M42 110 L40 195"

stroke="#8e24aa"

strokeWidth="4"

/>


<path

d="M58 110 L60 195"

stroke="#8e24aa"

strokeWidth="4"

/>

</>

}



</>

)

}









return (

<>


<path

d="M45 80 L40 210 Q50 225 60 210 L55 80"

fill="#edf2f5"

stroke="#9aa9b5"

/>




{

rootCanal &&

<path

d="M50 100 L50 205"

stroke="#8e24aa"

strokeWidth="4"

/>

}



</>

)


}









function drawCrown(type,crown,filling){


const color = crown

?

"#fdd835"

:

"#eaf5ef";








if(type==="molar"){


return (

<>



<path

d="
M18 25
Q20 10 38 12
Q50 5 62 12
Q80 10 82 25
L78 65
Q50 90 22 65
Z
"

fill={color}

stroke="#8799a8"

strokeWidth="2"

/>





<circle

cx="35"

cy="35"

r="6"

fill="#d9ebe2"

/>



<circle

cx="50"

cy="30"

r="6"

fill="#d9ebe2"

/>



<circle

cx="65"

cy="35"

r="6"

fill="#d9ebe2"

/>






<path

d="M50 18 L50 75"

stroke="#aab7c2"

strokeWidth="2"

/>





{

filling &&


<ellipse

cx="50"

cy="55"

rx="15"

ry="10"

fill="#42a5f5"

/>


}



</>

)

}









if(type==="premolar"){


return (

<>



<path

d="
M30 25
Q50 5 70 25
L65 70
Q50 90 35 70
Z
"

fill={color}

stroke="#8799a8"

strokeWidth="2"

/>




<path

d="M50 20 L50 70"

stroke="#aab7c2"

strokeWidth="2"

/>





{

filling &&

<circle

cx="50"

cy="50"

r="10"

fill="#42a5f5"

/>


}



</>

)

}









if(type==="canine"){


return (

<>



<path

d="
M50 8
L70 30
L60 75
Q50 90 40 75
L30 30
Z
"

fill={color}

stroke="#8799a8"

strokeWidth="2"

/>





<path

d="M50 20 L50 70"

stroke="#aab7c2"

/>





</>

)

}









return (

<>



<path

d="
M32 18
Q50 8 68 18
L66 75
Q50 90 34 75
Z
"

fill={color}

stroke="#8799a8"

strokeWidth="2"

/>




<path

d="M50 20 L50 75"

stroke="#aab7c2"

/>



</>

)

}