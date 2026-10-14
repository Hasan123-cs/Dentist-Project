import { Box, Typography } from "@mui/material";
import ToothCircle from "./ToothCircle";


const molars = [
  16,17,18,
  26,27,28,
  36,37,38,
  46,47,48
];

const premolars = [
  14,15,
  24,25,
  34,35,
  44,45
];

const canines = [
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
  conditions = {},
  status,
  selected,
  onClick,
  onSurfaceClick,
  isUpper,
  bridgeSelected = false,
  bridgeMode = false,

}){


  const type = getType(number);



  return (

    <Box

      onClick={onClick}

      sx={{

        width:60,
        minWidth:60,

        display:"flex",
        flexDirection:"column",

        alignItems:"center",

        cursor:"pointer",

        borderRadius:3,


        background:

          bridgeSelected
          ?
          "#28a745"

          :

          selected
          ?
          "rgba(201,162,39,.15)"

          :

          "transparent",


        border:

          bridgeMode
          ?
          "2px solid #ffc107"

          :
          "none",


        py:1,

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

          transform:

            isUpper

            ?

            "none"

            :

            "rotate(180deg)",

        }}

      >


        <ToothSVG

          type={type}

          conditions={conditions}

        />


      </Box>





      <Box mt={1}>

        <ToothCircle

          condition={conditions}

          status={status}

          onSurfaceClick={onSurfaceClick}

        />

      </Box>



    </Box>

  );

}









function ToothSVG({

  type,

  conditions,

}){


  const values =

    Object.values(conditions)

    .flat()

    .map(x =>
      String(x).toLowerCase()
    );





  const missing =
    values.includes("missing");



  const rootCanal =
    values.includes("rootcanal") ||
    values.includes("root canal");



  const crown =
    values.includes("crown");



  const implant =
    values.includes("implant");



  const bridge =
    values.includes("bridge");



  const filling =
    values.includes("filling");






  if(missing){

    return (

      <Box

        sx={{

          height:"100%",

          display:"flex",

          alignItems:"center",

          justifyContent:"center",

          fontSize:45,

          color:"#bdbdbd",

        }}

      >

        ×

      </Box>

    );

  }






  return (

    <svg

      width="55"

      height="120"

      viewBox="0 0 100 240"

    >


      {drawRoots(type,rootCanal)}



      {drawCrown(

        type,

        crown,

        filling,

        implant,

        bridge

      )}



    </svg>

  );

}









function drawRoots(type,rootCanal){


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





      {rootCanal && (

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

      )}



    </>

  );

}









function drawCrown(

  type,

  crown,

  filling,

  implant,

  bridge

){



  let color = "#e8f7ee";



  // priority for base

  if(bridge){

    color="#ffb15c";

  }

  else if(implant){

    color="#ef4444";

  }

  else if(crown){

    color="#fdd835";

  }






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





      {/* Crown marker over implant */}

      {crown && implant && (

        <path

          d="
          M25 30
          Q50 15 75 30
          "

          stroke="#fdd835"

          strokeWidth="6"

          fill="none"

        />

      )}





      {/* Filling surface */}

      {filling && (

        <ellipse

          cx="50"

          cy="55"

          rx="15"

          ry="10"

          fill="#42a5f5"

        />

      )}



    </>

  );

}