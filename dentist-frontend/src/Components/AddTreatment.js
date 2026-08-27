import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import { useState } from "react";



export default function AddTreatment(){


  const { id } = useParams();

  const navigate = useNavigate();



  const [form,setForm] = useState({

    treatment:"",

    tooth:"",

    status:"Pending",

    price:"",

    duration:"",

    notes:""

  });



  const [error,setError] = useState("");





  const handleChange=(e)=>{


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  };






  const handleSubmit=(e)=>{


    e.preventDefault();



    if(!form.treatment || !form.tooth){

      setError(
        "Treatment name and tooth are required"
      );

      return;

    }



    console.log({

      patientId:id,

      ...form

    });



    /*
      Backend later:

      POST
      /api/patients/{id}/treatments

    */



    navigate(
      `/patients/${id}?tab=treatment`
    );


  };






  return (


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

          border:"1px solid #eee3c5",

          background:"#fff"

        }}

      >



        <Typography

          fontSize={28}

          fontWeight={800}

          color="#092c57"

          mb={1}

        >

          Add Treatment

        </Typography>



        <Typography

          color="#718096"

          mb={3}

        >

          Patient ID #{id}

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

            gap:2

          }}

        >





          <TextField

            label="Treatment Name"

            name="treatment"

            value={form.treatment}

            onChange={handleChange}

            fullWidth

          />






          <TextField

            label="Tooth Number"

            name="tooth"

            value={form.tooth}

            onChange={handleChange}

            fullWidth

          />






          <TextField

            select

            label="Status"

            name="status"

            value={form.status}

            onChange={handleChange}

            fullWidth

          >


            <MenuItem value="Pending">
              Pending
            </MenuItem>


            <MenuItem value="In Progress">
              In Progress
            </MenuItem>


            <MenuItem value="Completed">
              Completed
            </MenuItem>


          </TextField>







          <TextField

            label="Price"

            name="price"

            value={form.price}

            onChange={handleChange}

            fullWidth

          />







          <TextField

            label="Duration"

            name="duration"

            placeholder="Example: 60 min"

            value={form.duration}

            onChange={handleChange}

            fullWidth

          />







          <TextField

            label="Notes"

            name="notes"

            multiline

            rows={4}

            value={form.notes}

            onChange={handleChange}

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

              onClick={()=>navigate(`/patients/${id}?tab=treatment`)}

              sx={{

                borderColor:"#C9A227",

                color:"#C9A227"

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

                "&:hover":{

                  background:"#b18c1f"

                }

              }}

            >

              SAVE TREATMENT

            </Button>




          </Box>





        </Box>



      </Paper>



    </Box>


  );

}