import { Box, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import axios from "axios";

import Tooth from "./Tooth";
import ToothPanel from "./ToothPanel";



export default function DentalChart({
  patientId,
  conditions,
  setConditions
}) {


  const [selectedTooth,setSelectedTooth]=useState(null);

  const [selectedTeeth,setSelectedTeeth]=useState([]);

  const [bridgeMode,setBridgeMode]=useState(false);

  const [selectedSurface,setSelectedSurface]=useState(null);



  const upperRight=[18,17,16,15,14,13,12,11];

  const upperLeft=[21,22,23,24,25,26,27,28];

  const lowerRight=[48,47,46,45,44,43,42,41];

  const lowerLeft=[31,32,33,34,35,36,37,38];






useEffect(()=>{


if(!patientId)
return;



const fetchDentalChart=async()=>{


try{


const token=localStorage.getItem("token");



const response=await axios.get(

`https://localhost:7166/api/DentalChart/patient/${patientId}`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);





const chartData={};





response.data.forEach(item=>{


const tooth=item.toothNumber;



if(!chartData[tooth])
chartData[tooth]={};





if(!item.surface){


if(item.condition==="RootCanal")

chartData[tooth].rootCanal="Root Canal";



if(item.condition==="Missing")

chartData[tooth].missing="missing";



if(item.condition==="Bridge")

chartData[tooth].bridge="bridge";



return;

}





const condition=

item.condition.charAt(0).toLowerCase()
+
item.condition.slice(1);




chartData[tooth][item.surface]=condition;



});




setConditions(chartData);



}

catch(error){

console.error(error);

}


};



fetchDentalChart();



},[patientId,setConditions]);







const updateCondition=(surface,value)=>{


if(value==="bridge"){


setConditions(prev=>{


const updated={...prev};



selectedTeeth.forEach(tooth=>{


updated[tooth]={

...(updated[tooth]||{}),

bridge:"bridge"

};


});



return updated;


});



setSelectedTeeth([]);

setBridgeMode(false);


return;


}







if(!selectedTooth)
return;





if(value==="rootCanal" || value==="missing"){


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






if(!surface)
return;





setConditions(prev=>({


...prev,


[selectedTooth]:{


...(prev[selectedTooth]||{}),


[surface]:value


}



}));



};




  const renderTeeth = (list, isUpper) => {

    return list.map((number)=>(

      <Tooth

        key={number}

        number={number}

        isUpper={isUpper}


        selected={

          bridgeMode

          ?

          selectedTeeth.includes(number)

          :

          selectedTooth === number

        }


        conditions={conditions[number] || {}}



        onClick={()=>{


          if(bridgeMode){


            setSelectedTeeth(prev=>


              prev.includes(number)

              ?

              prev.filter(t=>t!==number)

              :

              [...prev,number]

            );


          }

          else{


            setSelectedTooth(number);


          }


          setSelectedSurface(null);


        }}



        onSurfaceClick={(surface)=>{


          if(!bridgeMode){


            setSelectedTooth(number);

            setSelectedSurface(surface);


          }


        }}



      />

    ));

  };








  const ToothRow = ({right,left,isUpper}) => (

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



      {/* RIGHT */}

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





      {/* CENTER LINE */}

      <Box

        sx={{

          height:150,

          width:"2px",

          background:"#ddd",

          mx:1,

          flexShrink:0

        }}

      />





      {/* LEFT */}

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


selectedTeeth={selectedTeeth}


bridgeMode={bridgeMode}


setBridgeMode={setBridgeMode}



selectedSurface={selectedSurface}


setSelectedSurface={setSelectedSurface}



setCondition={updateCondition}



getCondition={(tooth,surface)=>

conditions[tooth]?.[surface]

}


/>







</Box>

);

}