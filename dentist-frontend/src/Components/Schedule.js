import { Paper, Typography, Box, Chip } from "@mui/material";

const appointments = [
  {
    time: "12:30",
    name: "Jane Garcia",
    type: "Consultation",
  },
  {
    time: "10:00",
    name: "Maria Johnson",
    type: "Treatment",
  },
  {
    time: "11:00",
    name: "Maria Johnson",
    type: "Cleaning",
  },
  {
    time: "13:30",
    name: "Maria Miller",
    type: "Cleaning",
  },
];

export default function Schedule() {
  return (
    <Paper
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5edf5",
      }}
    >
      <Typography fontSize={20} fontWeight={700} color="#092c57" mb={3}>
        Today's Schedule
      </Typography>

      {appointments.map((item) => (
        <Box
          key={item.time}
          sx={{
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #e8eef6",
            borderRadius: 3,
            px: 3,
            mb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={5}>
            <Typography fontWeight={700} color="#0755a0">
              {item.time}
            </Typography>

            <Box>
              <Typography fontWeight={700}>{item.name}</Typography>

              <Typography fontSize={14} color="text.secondary">
                {item.type}
              </Typography>
            </Box>
          </Box>

          <Chip label="Completed" color="success" size="small" />
        </Box>
      ))}
    </Paper>
  );
}
