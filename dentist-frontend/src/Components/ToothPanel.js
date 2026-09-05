import React from "react";

import {
  Box,
  Typography,
  Button
} from "@mui/material";



const conditions = [

  {
    name:"healthy",
    label:"Healthy",
    color:"#e8f7ee"
  },

  {
    name:"filling",
    label:"Filling",
    color:"#42a5f5"
  },

  {
    name:"crown",
    label:"Crown",
    color:"#fdd835"
  },

  {
    name:"missing",
    label:"Missing",
    color:"#bdbdbd"
  },

  {
    name:"implant",
    label:"Implant",
    color:"#8e7dff"
  },

  {
    name:"rootCanal",
    label:"Root Canal",
    color:"#8e24aa"
  },

  {
    name:"bridge",
    label:"Bridge",
    color:"#ffb15c"
  }

];





const surfaces=[

  {
    name:"M",
    label:"Mesial"
  },

  {
    name:"O",
    label:"Occlusal"
  },

  {
    name:"D",
    label:"Distal"
  },

  {
    name:"B",
    label:"Buccal"
  },

  {
    name:"L",
    label:"Lingual"
  }

];






export default function ToothPanel({

  tooth,

  selectedTeeth,

  bridgeMode,

  setBridgeMode,

  selectedSurface,

  setSelectedSurface,

  setCondition,

  getCondition

}) {



if(!tooth && !bridgeMode)
  return null;





const currentCondition =

selectedSurface && tooth

?

getCondition(
  tooth,
  selectedSurface
)

:

null;









const handleConditionClick=(condition)=>{



// Start bridge selection

if(condition==="bridge"){


  setBridgeMode(true);

  setSelectedSurface(null);

  return;

}







// Apply root canal / missing

if(
condition==="rootCanal" ||
condition==="missing"
){


  setCondition(
    null,
    condition
  );


  setSelectedSurface(null);


  return;

}







// Normal treatments

if(!selectedSurface)
return;



setCondition(

selectedSurface,

condition

);



};









const applyBridge=()=>{


if(!selectedTeeth || selectedTeeth.length===0)
  return;



setCondition(
  null,
  "bridge"
);



};









return (


<Box

sx={{

mt:4,

p:3,

border:"1px solid #eee3c5",

borderRadius:3,

background:"#faf8f2"

}}

>




<Typography

fontSize={20}

fontWeight={800}

color="#092c57"

mb={2}

>

{

bridgeMode

?

`Selected Teeth: ${selectedTeeth.length}`

:

`Selected Tooth: ${tooth}`

}

</Typography>







{

bridgeMode &&


<Box mb={3}>


<Typography

fontSize={14}

color="#555"

mb={2}

>

Click on teeth to add them to the bridge.

</Typography>



<Button

variant="contained"

onClick={applyBridge}

disabled={
!selectedTeeth ||
selectedTeeth.length===0
}

sx={{

background:"#ffb15c",

color:"#092c57",

fontWeight:800

}}

>

Apply Bridge

</Button>



</Box>

}










{

!bridgeMode &&

<>

<Typography

fontWeight={700}

fontSize={13}

color="#555"

mb={1}

>

Select Surface

</Typography>






<Box

display="flex"

gap={1}

flexWrap="wrap"

mb={3}

>


{

surfaces.map(surface=>(


<Button

key={surface.name}

onClick={()=>setSelectedSurface(surface.name)}

sx={{

width:55,

height:40,

borderRadius:2,

fontWeight:800,

background:

selectedSurface===surface.name

?

"#092c57"

:

"#fff",

color:

selectedSurface===surface.name

?

"#fff"

:

"#092c57"

}}

>

{surface.name}

</Button>


))

}


</Box>








{

selectedSurface &&


<Typography

fontSize={13}

color="#718096"

mb={2}

>

Current:

<b>

{" "}

{currentCondition || "Healthy"}

</b>

</Typography>


}



</>

}










<Typography

fontWeight={700}

fontSize={13}

color="#555"

mb={1}

>

Treatment / Condition

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

onClick={()=>handleConditionClick(item.name)}

sx={{

background:item.color,

color:"#092c57",

fontWeight:700,

fontSize:12,

borderRadius:2,

px:2,

py:1,

border:"1px solid rgba(0,0,0,.1)"

}}

>

{item.label}

</Button>


))

}


</Box>









{

!selectedSurface && !bridgeMode &&


<Typography

mt={2}

fontSize={12}

color="#888"

>

Select a tooth surface first (except Root Canal and Missing).

</Typography>


}




</Box>


);


}