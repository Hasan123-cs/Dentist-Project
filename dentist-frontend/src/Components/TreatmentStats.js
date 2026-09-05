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


import {
    useEffect,
    useState
} from "react";


import axios from "axios";





export default function TreatmentStats(){



const [stats,setStats] = useState([

{
    title:"Total Treatments",
    value:0,
    icon:<MedicalServices />,
    color:"#C9A227"
},


{
    title:"Completed",
    value:0,
    icon:<CheckCircle />,
    color:"#16a34a"
},


{
    title:"Pending",
    value:0,
    icon:<Pending />,
    color:"#f59e0b"
},


{
    title:"Total Revenue",
    value:"$0",
    icon:<AttachMoney />,
    color:"#2563eb"
}

]);






useEffect(()=>{


const getStats = async()=>{


try{


const res = await axios.get(
"https://localhost:7166/api/treatments/all"
);



const treatments = res.data;



const total = treatments.length;



const completed =
treatments.filter(
t=>t.status === "Completed"
).length;



const pending =
treatments.filter(
t=>
t.status === "Scheduled" ||
t.status === "Pending"
).length;



const revenue =
treatments.reduce(
(sum,t)=>sum + t.price,
0
);







setStats([


{
    title:"Total Treatments",
    value:total,
    icon:<MedicalServices />,
    color:"#C9A227"
},



{
    title:"Completed",
    value:completed,
    icon:<CheckCircle />,
    color:"#16a34a"
},



{
    title:"Pending",
    value:pending,
    icon:<Pending />,
    color:"#f59e0b"
},



{
    title:"Total Revenue",
    value:`$${revenue}`,
    icon:<AttachMoney />,
    color:"#2563eb"
}



]);



}

catch(error){

console.log(
"Error loading treatment stats",
error
);

}



};



getStats();


},[]);









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