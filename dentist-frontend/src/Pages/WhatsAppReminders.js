import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";

import {
  appointmentReminderArabic,
  cleaningReminderArabic,
  appointmentReminderEnglish,
  cleaningReminderEnglish,
  cleaningReminderBoth,
  appointmentReminderBoth
} from "../translate/whatsappMessages";

import {
  WhatsApp,
  Search,
} from "@mui/icons-material";

import {
  useEffect,
  useState
} from "react";
import { PageLoading } from "../Components/PageState";
import InboxOutlined from "@mui/icons-material/InboxOutlined";
import { createWhatsAppUrl } from "../utils/whatsapp";
import {
  getTodayLebanonDate,
  getTomorrowLebanonDate,
} from "../utils/dateTime";



export default function WhatsAppReminders() {


  const [reminders, setReminders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // selected message language
  const [language, setLanguage] = useState("both");
  const [reminderFilter, setReminderFilter] = useState("notSubmitted");
  const [reminderTypeFilter, setReminderTypeFilter] = useState("all");
  const [patientSearch, setPatientSearch] = useState("");
  const [savingReminderId, setSavingReminderId] = useState(null);




  useEffect(() => {

    loadReminders();

  }, []);





  const loadReminders = async () => {

    try {

      const token = localStorage.getItem("token");


      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notifications/reminders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const responseBody = await response.text();
      let data;
      try {
        data = responseBody ? JSON.parse(responseBody) : [];
      } catch {
        if (!response.ok) {
          throw new Error(
            `Failed to load reminders (HTTP ${response.status}): ${responseBody}`,
          );
        }
        throw new Error("The reminders response was not valid JSON.");
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.title ||
            `Failed to load reminders (HTTP ${response.status}).`,
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("The reminders response did not contain a reminder list.");
      }


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
      else if (language === "both") {

        message = appointmentReminderBoth(item.patientName, item.date, item.time);

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
      else if (language === "both") {

        message = cleaningReminderBoth(item.patientName);

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

    const whatsappUrl = createWhatsAppUrl(item.phone, message);
    if (!whatsappUrl) {
      setError("Patient phone number not found.");
      return;
    }

    window.open(
      whatsappUrl,
      "_blank"
    );

  };

  const markReminderAsSubmitted = async (item) => {
    if (item.isSent) {
      return;
    }

    setSavingReminderId(item.id);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/notifications/reminders/${item.id}/sent`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update reminder status.");
      }

      setReminders((current) =>
        current.map((reminder) =>
          reminder.id === item.id ? { ...reminder, isSent: true } : reminder
        )
      );
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "Failed to update reminder status.");
    } finally {
      setSavingReminderId(null);
    }
  };

  const normalizedSearch = patientSearch.trim().toLocaleLowerCase();
  const searchDigits = patientSearch.replace(/\D/g, "");
  const todayDate = getTodayLebanonDate();
  const tomorrowDate = getTomorrowLebanonDate();
  const isFutureCleaningReminder = (reminder) =>
    reminder.type === "CleaningReminder" &&
    Boolean(reminder.date) &&
    reminder.date > todayDate;
  const allTimeReminders = reminders.filter(
    (reminder) => reminder.isSent || !isFutureCleaningReminder(reminder),
  );
  const filteredReminders = reminders.filter((reminder) => {
    const matchesStatus =
      (reminderFilter === "all" &&
        (reminder.isSent || !isFutureCleaningReminder(reminder))) ||
      (reminderFilter === "submitted" && reminder.isSent) ||
      (reminderFilter === "notSubmitted" &&
        !reminder.isSent &&
        !isFutureCleaningReminder(reminder)) ||
      (reminderFilter === "tomorrowSubmitted" &&
        reminder.isSent &&
        reminder.date === tomorrowDate) ||
      (reminderFilter === "tomorrowNotSubmitted" &&
        !reminder.isSent &&
        reminder.date === tomorrowDate);
    const matchesType =
      reminderTypeFilter === "all" ||
      (reminderTypeFilter === "appointments" &&
        reminder.type === "AppointmentReminder") ||
      (reminderTypeFilter === "cleaning" &&
        reminder.type === "CleaningReminder");
    const matchesName = reminder.patientName
      ?.toLocaleLowerCase()
      .includes(normalizedSearch);
    const matchesPhone =
      searchDigits.length > 0 &&
      reminder.phone?.replace(/\D/g, "").includes(searchDigits);

    return (
      matchesStatus &&
      matchesType &&
      (!normalizedSearch || matchesName || matchesPhone)
    );
  });

  const submittedCount = reminders.filter((reminder) => reminder.isSent).length;
  const notSubmittedCount = allTimeReminders.filter(
    (reminder) => !reminder.isSent,
  ).length;
  const tomorrowSubmittedCount = reminders.filter(
    (reminder) => reminder.isSent && reminder.date === tomorrowDate,
  ).length;
  const tomorrowNotSubmittedCount = reminders.filter(
    (reminder) => !reminder.isSent && reminder.date === tomorrowDate,
  ).length;
  const statusOptions = [
    { value: "all", label: "All reminders", count: allTimeReminders.length },
    { value: "submitted", label: "Submitted (all time)", count: submittedCount },
    {
      value: "notSubmitted",
      label: "Not submitted (all time)",
      count: notSubmittedCount,
    },
    {
      value: "tomorrowNotSubmitted",
      label: "Tomorrow not submitted",
      count: tomorrowNotSubmittedCount,
    },
    {
      value: "tomorrowSubmitted",
      label: "Tomorrow submitted",
      count: tomorrowSubmittedCount,
    },
  ];














  if (loading) {
    return <PageLoading label="Loading reminders..." />;
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

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid #eee3c5",
          background: "#fff",
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={patientSearch}
          onChange={(event) => setPatientSearch(event.target.value)}
          placeholder="Search patient by name or phone number"
          aria-label="Search reminders by patient name or phone number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#8a7a55" }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <RadioGroup
          row
          aria-label="Filter reminders by submission status and date"
          value={reminderFilter}
          onChange={(event) => setReminderFilter(event.target.value)}
          sx={{ gap: 1, flexWrap: "wrap" }}
        >
          {statusOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#a89a78",
                    "&.Mui-checked": { color: "#092c57" },
                  }}
                />
              }
              label={
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {option.label}
                  <Chip
                    size="small"
                    label={option.count}
                    sx={{
                      height: 22,
                      fontWeight: 700,
                      background:
                        reminderFilter === option.value ? "#e8eef5" : "#f3f1eb",
                      color: "#092c57",
                    }}
                  />
                </Box>
              }
              sx={{
                m: 0,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor:
                  reminderFilter === option.value ? "#092c57" : "#eee3c5",
                background:
                  reminderFilter === option.value ? "#f1f5f9" : "#fff",
                color: reminderFilter === option.value ? "#092c57" : "#5f6470",
                fontWeight: reminderFilter === option.value ? 700 : 500,
                transition: "all 150ms ease",
                "&:hover": { background: "#f7f8fa" },
              }}
            />
          ))}
        </RadioGroup>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight={700} color="#092c57" mb={1}>
          Reminder type
        </Typography>
        <RadioGroup
          row
          aria-label="Filter reminders by type"
          value={reminderTypeFilter}
          onChange={(event) => setReminderTypeFilter(event.target.value)}
          sx={{ gap: 1, flexWrap: "wrap" }}
        >
          {[
            { value: "all", label: "All types" },
            { value: "appointments", label: "Appointments" },
            { value: "cleaning", label: "Cleaning" },
          ].map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#a89a78",
                    "&.Mui-checked": { color: "#092c57" },
                  }}
                />
              }
              label={option.label}
              sx={{ m: 0 }}
            />
          ))}
        </RadioGroup>
      </Paper>





      {/* Language buttons */}

      <Box



        mb={4}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center"
          },
          flexDirection: {
            xs: "column",
            sm: "row"
          },
          gap: 2
        }}
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

        <Button
          variant="contained"
          onClick={() => setLanguage("both")}
          sx={{

            background:
              language === "both"
                ? "#6b5b3e"
                : "#ddd",

            color:
              language === "both"
                ? "#fff"
                : "#333"

          }}
        >
          Both
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

        filteredReminders.length === 0

          ?

          (

            <Paper

              sx={{

                p: 4,

                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                color: "#718096",
                textAlign: "center"

              }}

            >

              <InboxOutlined sx={{ fontSize: 40, color: "#9aa7b5" }} />
              <Typography>

                {reminders.length === 0
                  ? "No reminders available"
                  : "No reminders match your search and selected filter"}

              </Typography>

            </Paper>

          )

          :

          filteredReminders.map((item) => (



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

                  {item.date && (
                    <Typography color="text.secondary" fontSize={13} mt={0.5}>
                      {item.date}{item.time ? ` · ${item.time}` : ""}
                    </Typography>
                  )}


                </Box>







                <Chip
                  label={item.isSent ? "Submitted" : "Not submitted"}
                  color={item.isSent ? "success" : "default"}
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

              <FormControlLabel
                sx={{ mt: 2, ml: 0 }}
                control={
                  <Radio
                    checked={Boolean(item.isSent)}
                    disabled={Boolean(item.isSent) || savingReminderId === item.id}
                    onChange={() => markReminderAsSubmitted(item)}
                  />
                }
                label={
                  savingReminderId === item.id
                    ? "Saving..."
                    : item.isSent
                      ? "Submitted"
                      : "Mark as submitted"
                }
              />







            </Paper>



          ))

      }





    </Box>

  );


}