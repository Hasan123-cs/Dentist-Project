import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
} from "@mui/material";

import {
  appointmentReminderArabic,
  cleaningReminderArabic,
  appointmentReminderEnglish,
  cleaningReminderEnglish
} from "../translate/whatsappMessages";

import {
  WhatsApp,
} from "@mui/icons-material";

import {
  useEffect,
  useState
} from "react";



export default function WhatsAppReminders() {


  const [reminders, setReminders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // selected message language
  const [language, setLanguage] = useState("ar");




  useEffect(() => {

    loadReminders();

  }, []);





  const loadReminders = async () => {

    try {

      const token = localStorage.getItem("token");


      const response = await fetch(
        "https://localhost:7166/api/notifications/reminders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to load reminders"
        );

      }



      const data = await response.json();


      console.log("REMINDERS:", data);


      setReminders(data);


    }
    catch (error) {

      console.log(error);

      setError(error.message);

    }
    finally {

      setLoading(false);

    }

  };


  const sendWhatsAppNotification = (item) => {


    const patientPhone = item.phone;


    let message = "";



    console.log("ITEM SENT TO WHATSAPP:", item);



    if (item.type === "AppointmentReminder") {


      if (language === "ar") {


        message = appointmentReminderArabic(
          item.patientName,
          item.date,
          item.time
        );


      }
      else {


        message = appointmentReminderEnglish(
          item.patientName,
          item.date,
          item.time
        );


      }


    }





    if (item.type === "CleaningReminder") {


      if (language === "ar") {


        message = cleaningReminderArabic(
          item.patientName,
          item.date
        );


      }
      else {


        message = cleaningReminderEnglish(
          item.patientName,
          item.date
        );


      }


    }




    console.log(
      "WHATSAPP MESSAGE:",
      message
    );



    const whatsappUrl =
      `https://wa.me/${patientPhone}?text=${encodeURIComponent(message)}`;



    window.open(
      whatsappUrl,
      "_blank"
    );


  };














  if (loading) {

    return (

      <Box p={4}>
        Loading reminders...
      </Box>

    );

  }







  return (

    <Box

      sx={{

        width: "100%",

        minHeight: "100vh",

        background: "#faf8f2",

        p: 4

      }}

    >




      <Typography

        fontSize={32}

        fontWeight={800}

        color="#092c57"

      >

        WhatsApp Reminders

      </Typography>





      <Typography

        color="#8a7a55"

        mb={3}

      >

        Choose message language then send WhatsApp notification

      </Typography>





      {/* Language buttons */}

      <Box

        display="flex"

        gap={2}

        mb={4}

      >


        <Button

          variant="contained"

          onClick={() => setLanguage("ar")}

          sx={{

            background:
              language === "ar"
                ?
                "#C9A227"
                :
                "#ddd",

            color:
              language === "ar"
                ?
                "#fff"
                :
                "#333"

          }}

        >

          العربية

        </Button>





        <Button

          variant="contained"

          onClick={() => setLanguage("en")}

          sx={{

            background:
              language === "en"
                ?
                "#092c57"
                :
                "#ddd",

            color:
              language === "en"
                ?
                "#fff"
                :
                "#333"

          }}

        >

          English

        </Button>


      </Box>







      {
        error &&

        <Typography

          color="error"

          mb={3}

        >

          {error}

        </Typography>

      }








      {

        reminders.length === 0

          ?

          (

            <Paper

              sx={{

                p: 4,

                borderRadius: 4

              }}

            >

              <Typography>

                No reminders available

              </Typography>

            </Paper>

          )

          :

          reminders.map((item) => (



            <Paper

              key={item.id}

              sx={{

                p: 3,

                mb: 3,
                marginTop: 3,
                borderRadius: 4,

                border: "1px solid #eee3c5",

                background: "#fff"

              }}

            >




              <Box

                display="flex"

                justifyContent="space-between"

                alignItems="center"

              >




                <Box>


                  <Typography

                    fontSize={18}

                    fontWeight={800}

                  >

                    {item.patientName}

                  </Typography>





                  <Typography

                    color="text.secondary"

                  >

                    {item.message}

                  </Typography>



                </Box>







                <Chip

                  label="Ready"

                  color="success"

                />





              </Box>








              <Button

                variant="contained"

                startIcon={<WhatsApp />}

                onClick={() => sendWhatsAppNotification(item)}

                sx={{

                  mt: 3,

                  background: "#25D366",

                  fontWeight: 700,


                  "&:hover": {

                    background: "#1da851"

                  }

                }}

              >

                Send Notification

              </Button>








            </Paper>



          ))

      }





    </Box>

  );


}