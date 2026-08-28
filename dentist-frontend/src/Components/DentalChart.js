import { Box, Typography } from "@mui/material";

import { useState } from "react";
import Tooth from "./Tooth";
import ToothPanel from "./ToothPanel";



export default function DentalChart({

    conditions,

    setConditions

}){



const [selectedTooth,setSelectedTooth]=useState(null);

const [selectedSurface,setSelectedSurface]=useState(null);





const upperRight=[18,17,16,15,14,13,12,11];

const upperLeft=[21,22,23,24,25,26,27,28];


const lowerRight=[48,47,46,45,44,43,42,41];

const lowerLeft=[31,32,33,34,35,36,37,38];









const updateCondition=(surface,value)=>{


    if(!selectedTooth)
        return;







    // ROOT CANAL + MISSING WITHOUT SURFACE

    if(

        value==="rootCanal" ||

        value==="missing"

    ){



        setConditions(prev=>({


            ...prev,


            [selectedTooth]:{


                [value]:

                value==="rootCanal"

                ?

                "Root Canal"

                :

                "missing"



            }



        }));





        setSelectedSurface(null);


        return;


    }








    // OTHER CONDITIONS NEED SURFACE

    if(!surface)

        return;






    setConditions(prev=>({



        ...prev,



        [selectedTooth]:{


            ...(prev[selectedTooth] || {}),


            [surface]:value



        }



    }));





};












const renderTeeth=(list,isUpper)=>{


return list.map(number=>(


<Tooth


key={number}


number={number}


isUpper={isUpper}



selected={selectedTooth===number}



conditions={conditions[number] || {}}





onClick={()=>{


    setSelectedTooth(number);


    setSelectedSurface(null);



}}







onSurfaceClick={(surface)=>{


    setSelectedTooth(number);


    setSelectedSurface(surface);



}}





/>



));


};












const ToothRow=({right,left,isUpper})=>(



<Box

sx={{


width:"100%",


display:"flex",


flexDirection:"row",


justifyContent:"center",


alignItems:"flex-start",


flexWrap:"nowrap",


overflowX:"auto",


gap:1,


py:2



}}



>







{/* RIGHT SIDE */}


<Box

sx={{


display:"flex",


flexDirection:"row",


gap:0.5,


flexShrink:0



}}

>


{renderTeeth(right,isUpper)}



</Box>










{/* MID LINE */}



<Box

sx={{


height:150,


width:"2px",


background:"#ddd",


mx:1,


flexShrink:0



}}


/>









{/* LEFT SIDE */}



<Box

sx={{


display:"flex",


flexDirection:"row",


gap:0.5,


flexShrink:0



}}

>


{renderTeeth(left,isUpper)}



</Box>







</Box>



);














return (



<Box


sx={{


width:"100%",


background:"#fff",


borderRadius:3,


p:3,


boxSizing:"border-box",


overflow:"hidden"



}}



>







<Typography


textAlign="center"


fontSize={22}


fontWeight={800}


color="#092c57"



>


Dental Chart


</Typography>









<Typography


textAlign="center"


fontSize={13}


color="#718096"


mb={3}



>


Clinical Odontogram


<br/>


Patient Dental Chart



</Typography>












<Typography


textAlign="center"


fontWeight={800}


color="#092c57"


mb={2}



>


MAXILLARY (UPPER)



</Typography>









<ToothRow


right={upperRight}


left={upperLeft}


isUpper={true}


/>












<Box

sx={{


borderTop:"1px solid #ddd",


my:4



}}


/>









<Typography


textAlign="center"


fontWeight={800}


color="#092c57"


mb={2}



>


MANDIBULAR (LOWER)



</Typography>












<ToothRow


right={lowerRight}


left={lowerLeft}


isUpper={false}


/>













<ToothPanel


tooth={selectedTooth}


selectedSurface={selectedSurface}


setSelectedSurface={setSelectedSurface}


setCondition={updateCondition}



getCondition={(tooth,surface)=>{


return conditions[tooth]?.[surface];


}}



/>









</Box>



);



}