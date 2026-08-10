import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton
} from "@mui/material";


import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth
} from "@mui/icons-material";

import dayjs from "dayjs";



export default function CalendarToolbar({
  currentDate,
  setCurrentDate
}) {



const startOfWeek = currentDate
  .startOf("week")
  .add(1,"day");



const endOfWeek = startOfWeek
  .add(6,"day");




return (

<Paper

sx={{

mt:3,

p:2,

borderRadius:4,

border:"1px solid #eee3c5",

background:"#fff"

}}

>



<Box

display="flex"

justifyContent="space-between"

alignItems="center"

>



{/* Left */}

<Box

display="flex"

alignItems="center"

gap={2}

>


<CalendarMonth

sx={{

color:"#C9A227"

}}

/>



<Typography

fontWeight={700}

color="#3d2f12"

>

Calendar View

</Typography>



</Box>






{/* Date navigation */}

<Box

display="flex"

alignItems="center"

gap={2}

>



<IconButton

onClick={()=>{

setCurrentDate(

currentDate.subtract(1,"week")

)

}}

sx={{

border:"1px solid #eee3c5"

}}

>

<ChevronLeft/>

</IconButton>





<Typography

fontWeight={700}

color="#3d2f12"

>


{startOfWeek.format("MMM D")}

{" - "}

{endOfWeek.format("MMM D, YYYY")}



</Typography>






<IconButton

onClick={()=>{

setCurrentDate(

currentDate.add(1,"week")

)

}}

sx={{

border:"1px solid #eee3c5"

}}

>

<ChevronRight/>

</IconButton>



</Box>







{/* View buttons */}

<Box

display="flex"

gap={1}

>


<Button

sx={{

color:"#8a7a55"

}}

>

Day

</Button>



<Button

sx={{

color:"#8a7a55"

}}

>

3 Days

</Button>




<Button

sx={{

background:"#C9A227",

color:"#fff",

fontWeight:700,


"&:hover":{

background:"#b18c1f"

}

}}

>

Week

</Button>



</Box>





</Box>



</Paper>

)

}