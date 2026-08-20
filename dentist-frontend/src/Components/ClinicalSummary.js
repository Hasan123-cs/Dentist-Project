import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box
} from "@mui/material";



export default function ClinicalSummary({

    conditions = {}

}){



const rows = [];



Object.entries(conditions).forEach(
    ([tooth, data]) => {


        Object.entries(data).forEach(
            ([key, value]) => {


                rows.push({

                    tooth,

                    condition:value,

                    surface:
                    key === "rootCanal"
                    ?
                    "-"
                    :
                    key


                });


            }
        );


    }
);






return (


<Paper

sx={{

mt:3,

p:3,

borderRadius:4,

border:"1px solid #eee3c5",

background:"#fff"

}}

>


<Typography

fontSize={22}

fontWeight={800}

color="#C9A227"

mb={2}

>

Clinical Summary

</Typography>





{

rows.length === 0 ?


<Box>

<Typography

color="text.secondary"

>

No dental conditions recorded yet.

</Typography>

</Box>



:


<Table>


<TableHead>

<TableRow>


<TableCell

sx={{fontWeight:800}}

>
Tooth
</TableCell>



<TableCell

sx={{fontWeight:800}}

>
Condition
</TableCell>



<TableCell

sx={{fontWeight:800}}

>
Surface
</TableCell>



</TableRow>

</TableHead>





<TableBody>


{

rows.map((row,index)=>(


<TableRow

key={index}

>


<TableCell>

{row.tooth}

</TableCell>



<TableCell>

{row.condition}

</TableCell>



<TableCell>

{row.surface}

</TableCell>



</TableRow>


))


}



</TableBody>



</Table>


}




</Paper>


);


}