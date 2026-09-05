import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem
} from "@mui/material";


import {
  useNavigate
} from "react-router-dom";


import {
  useState
} from "react";


import axios from "axios";




export default function AddPatient(){


const navigate = useNavigate();



const [form,setForm] = useState({

  name:"",
  phone:"",
  gender:"",
  birthDate:"",
  notes:""

});


const [error,setError] = useState("");






const handleChange = (e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};









const handleSubmit = async (e)=>{


e.preventDefault();



try{


await axios.post(

"https://localhost:7166/api/Patients",

{


fullName:form.name,


phone:form.phone,


gender:form.gender,


dateOfBirth:form.birthDate,


allergies:"None",


medicalHistory:form.notes


}

);



navigate("/patients");



}

catch(err){


console.log(
"Error creating patient:",
err
);


setError(
"Failed to create patient"
);


}



};









return(


<Box

sx={{

width:"100%",

minHeight:"100vh",

background:"#faf8f2",

p:4

}}

>



<Paper

sx={{

maxWidth:700,

mx:"auto",

p:4,

borderRadius:4,

background:"#fff",

border:"1px solid #eee3c5"

}}

>




<Typography

fontSize={28}

fontWeight={800}

color="#092c57"

mb={4}

textAlign="center"

>

Add New Patient

</Typography>





{
error &&

<Typography

color="error"

mb={2}

>

{error}

</Typography>

}







<Box

component="form"

onSubmit={handleSubmit}

sx={{

display:"flex",

flexDirection:"column",

gap:2.5

}}

>







<TextField

label="Full Name"

name="name"

value={form.name}

onChange={handleChange}

fullWidth

/>








<TextField

label="Phone"

name="phone"

value={form.phone}

onChange={handleChange}

fullWidth

/>








<TextField

select

label="Gender"

name="gender"

value={form.gender}

onChange={handleChange}

fullWidth

>


<MenuItem value="Male">

Male

</MenuItem>


<MenuItem value="Female">

Female

</MenuItem>


</TextField>









<TextField

label="Date of Birth"

name="birthDate"

value={form.birthDate}

onChange={handleChange}

type="date"

InputLabelProps={{

shrink:true

}}

fullWidth

/>









<TextField

label="Medical Notes"

name="notes"

value={form.notes}

onChange={handleChange}

multiline

rows={4}

fullWidth

/>









<Box

display="flex"

justifyContent="flex-end"

gap={2}

mt={2}

>



<Button

variant="outlined"

onClick={()=>navigate("/patients")}

sx={{

borderColor:"#C9A227",

color:"#C9A227",

fontWeight:700,

borderRadius:3,

px:3

}}

>

CANCEL

</Button>







<Button

type="submit"

variant="contained"

sx={{

background:"#C9A227",

fontWeight:700,

borderRadius:3,

px:3,

"&:hover":{

background:"#b18c1f"

}

}}

>

SAVE PATIENT

</Button>





</Box>





</Box>





</Paper>





</Box>


);


}