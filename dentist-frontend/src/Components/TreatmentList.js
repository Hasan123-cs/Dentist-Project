import { Alert, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TreatmentCard from "./TreatmentCard";
import { EmptyState, PageLoading } from "./PageState";
import { fetchJsonCached } from "../api/requestCache";

export default function TreatmentList({ search }) {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadTreatments = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const keyword = search.trim();
        const url = keyword
          ? `${process.env.REACT_APP_API_URL}/api/patients/search-treatments?keyword=${encodeURIComponent(keyword)}`
          : `${process.env.REACT_APP_API_URL}/api/patients/all-treatments`;
        const data = await fetchJsonCached(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active) setTreatments(Array.isArray(data) ? data : []);
      } catch (loadError) {
        console.error("Unable to load treatments.", loadError);
        if (active) setError(loadError.message || "Failed to load treatments.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTreatments();

    return () => {
      active = false;
    };
  }, [search]);

  if (loading) {
    return <PageLoading label="Loading treatments..." />;
  }

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Typography fontSize={22} fontWeight={800} color="#092c57" mb={3}>
        All Treatments ({treatments.length})
      </Typography>

      {error ? null : treatments.length === 0 ? (
        <EmptyState
          title={search ? "No treatments found" : "No treatments yet"}
          description={search ? "Try another search." : "Treatments will appear here when added."}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
            gap: { xs: 2, sm: 3 },
          }}
        >
          {treatments.map((item) => (
            <TreatmentCard
              key={item.id}
              treatment={item}
              onDelete={(id) => {
                setTreatments((previous) =>
                  previous.filter((treatment) => treatment.id !== id),
                );
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
