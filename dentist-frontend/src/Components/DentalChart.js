import {
    Box,
    Typography
} from "@mui/material";


import {
    useState
} from "react";


import Tooth from "./Tooth";
import ToothPanel from "./ToothPanel";





export default function DentalChart(){



    const [selectedTooth,setSelectedTooth] = useState(null);



    const [toothConditions,setToothConditions] = useState({});






    const upperRight = [
        18,17,16,15,14,13,12,11
    ];



    const upperLeft = [
        21,22,23,24,25,26,27,28
    ];



    const lowerRight = [
        48,47,46,45,44,43,42,41
    ];



    const lowerLeft = [
        31,32,33,34,35,36,37,38
    ];









    const renderTeeth = (teeth)=>(


        teeth.map(number=>(


            <Tooth


                key={number}


                number={number}



                condition={
                    toothConditions[number] || "healthy"
                }




                onClick={()=>{


                    setSelectedTooth(number);


                }}


            />


        ))


    );







return (



<Box>





<Typography

fontWeight={800}

color="#092c57"

mb={3}

textAlign="center"

>

Dental Chart

</Typography>









{/* UPPER */}




<Typography

textAlign="center"

fontSize={12}

color="#718096"

mb={2}

>

MAXILLARY (UPPER)

</Typography>







<Box

sx={{

display:"flex",

justifyContent:"center",

alignItems:"center",

width:"100%",

overflow:"auto",

gap:2

}}

>






<Box

sx={{

display:"flex",

flexDirection:"row",

gap:1

}}

>

{
    renderTeeth(upperRight)
}

</Box>







<Box

sx={{

height:80,

width:"2px",

background:"#ddd",

mx:2

}}

/>







<Box

sx={{

display:"flex",

flexDirection:"row",

gap:1

}}

>

{
    renderTeeth(upperLeft)
}

</Box>





</Box>









<Box

sx={{

borderTop:"1px solid #ddd",

my:4

}}

/>









{/* LOWER */}




<Typography

textAlign="center"

fontSize={12}

color="#718096"

mb={2}

>

MANDIBULAR (LOWER)

</Typography>








<Box

sx={{

display:"flex",

justifyContent:"center",

alignItems:"center",

width:"100%",

overflow:"auto",

gap:2

}}

>






<Box

sx={{

display:"flex",

flexDirection:"row",

gap:1

}}

>

{
    renderTeeth(lowerRight)
}

</Box>







<Box

sx={{

height:80,

width:"2px",

background:"#ddd",

mx:2

}}

/>







<Box

sx={{

display:"flex",

flexDirection:"row",

gap:1

}}

>

{
    renderTeeth(lowerLeft)
}

</Box>





</Box>









{/* CONDITION PANEL */}





<ToothPanel


tooth={selectedTooth}



condition={

    selectedTooth

    ?

    toothConditions[selectedTooth] || "healthy"

    :

    null

}




setCondition={(value)=>{


    setToothConditions(prev=>({


        ...prev,


        [selectedTooth]:value


    }));



}}



/>








</Box>



)



}