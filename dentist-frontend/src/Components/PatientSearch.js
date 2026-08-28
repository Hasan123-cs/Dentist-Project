import {
    Paper,
    TextField
} from "@mui/material";


import {
    Search
} from "@mui/icons-material";





export default function PatientSearch({

    search,

    setSearch

}){



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


value={search}



onChange={(e)=>{

setSearch(e.target.value);

}}



placeholder="Search patients..."



InputProps={{

startAdornment:

<Search

sx={{

mr:1,

color:"#999"

}}

/>

}}



sx={{


"& fieldset":{

borderColor:"#eee3c5"

}



}}


/>



</Paper>



)


}