import { Box, Typography } from "@mui/material";

import PatientCard from "./PatientCard";
import { EmptyState } from "./PageState";

export default function PatientList({
  patients,
  setPatients,
  error = "",
  title = "All Patients",
}) {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography
        fontSize={20}
        fontWeight={800}
        color="#092c57"
        mb={3}
        textAlign="center"
      >
        {title} ({patients.length})
      </Typography>

      {error ? null : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Try changing your search or balance filter."
        />
      ) : (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
          gap: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        {patients.map((p) => (
          <PatientCard
            key={p.id}
            patient={{
              id: p.id,
              name: `${p.firstName} ${p.lastName}`,
              phone: p.phone || "No phone",
              status: "Active",
              lastVisit: p.createdAt
                ? new Date(p.createdAt).toLocaleDateString()
                : "No visits",
              balance: p.balance,
            }}
            onUpdate={(id, updates) => {
              setPatients((previous) =>
                previous.map((patient) =>
                  patient.id === id
                    ? {
                        ...patient,
                        firstName: updates.firstName,
                        lastName: updates.lastName,
                        phone: updates.phone,
                      }
                    : patient,
                ),
              );
            }}
            onDelete={(id) => {
              setPatients((previous) => previous.filter((patient) => patient.id !== id));
            }}
          />
        ))}
      </Box>
      )}
    </Box>
  );
}
