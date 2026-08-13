import {
    Grid,
    Paper,
    Box,
    Typography
} from "@mui/material";


import {
    MedicalServices,
    CheckCircle,
    Pending,
    AttachMoney
} from "@mui/icons-material";



const stats=[


{
    title:"Total Treatments",
    value:24,
    icon:<MedicalServices />,
    color:"#C9A227"
},


{
    title:"Completed",
    value:15,
    icon:<CheckCircle />,
    color:"#16a34a"
},


{
    title:"Pending",
    value:6,
    icon:<Pending />,
    color:"#f59e0b"
},


{
    title:"Total Revenue",
    value:"$8,450",
    icon:<AttachMoney />,
    color:"#2563eb"
}



];





export default function TreatmentStats(){



return (


<Grid

container

spacing={3}

mb={4}

>


{

stats.map((item)=>(


<Grid

item

xs={12}

sm={6}

lg={3}

key={item.title}

>


<Paper


sx={{


p:3,


height:140,


borderRadius:4,


border:"1px solid #eee3c5",


background:"#fff",


display:"flex",


alignItems:"center",


gap:2,



boxShadow:"0 3px 10px rgba(0,0,0,.05)"

}}



>


<Box


sx={{


width:55,


height:55,


borderRadius:"50%",


background:"#faf7ed",


display:"flex",


alignItems:"center",


justifyContent:"center"


}}


>


<Box

sx={{

color:item.color,

display:"flex"

}}

>

{item.icon}

</Box>


</Box>






<Box>


<Typography

fontSize={13}

color="#718096"

>

{item.title}

</Typography>




<Typography

fontSize={28}

fontWeight={800}

color="#092c57"

>

{item.value}

</Typography>



</Box>





</Paper>


</Grid>


))


}



</Grid>


)


}