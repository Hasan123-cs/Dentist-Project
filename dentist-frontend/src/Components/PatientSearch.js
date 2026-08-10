import {
Paper,
Box,
TextField,
Button
} from "@mui/material";


import {
Search,
FilterList
} from "@mui/icons-material";


export default function PatientSearch(){

return (

<Paper

sx={{
p:2,
borderRadius:3,
border:"1px solid #eee3c5",
mb:3
}}

>


<TextField

fullWidth

placeholder="Search patients..."

InputProps={{
startAdornment:<Search sx={{mr:1,color:"#999"}}/>
}}

sx={{

"& fieldset":{
borderColor:"#eee3c5"
}

}}

/>


<Box
mt={2}
display="flex"
justifyContent="flex-end"
>

<Button
startIcon={<FilterList/>}
sx={{
color:"#8a6d1d"
}}
>
Filters
</Button>

</Box>


</Paper>

)

}