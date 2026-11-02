import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";

import PatientHeader from "../Components/PatientHeader";
import PatientSearch from "../Components/PatientSearch";
import PatientList from "../Components/PatientList";
import { PageLoading } from "../Components/PageState";
import { useSearchParams } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import { fetchJsonCached } from "../api/requestCache";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [balanceFilter, setBalanceFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const getPatients = async () => {
      try {
        const response = await fetchJsonCached(
          `${process.env.REACT_APP_API_URL}/api/patients`,
        );
        if (active) setPatients(response);
      } catch (error) {
        console.error("Unable to load patients.", error);
        if (active) setError(error.message || "Connection Error");
      } finally {
        if (active) setLoading(false);
      }
    };

    getPatients();

    return () => {
      active = false;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const value = search.toLowerCase();

    return patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const id = p.id?.toString() || "";
      const matchesSearch = fullName.includes(value) || id.includes(value);
      const matchesBalance =
        balanceFilter === "all" || Number(p.balance || 0) > 0;
      return matchesSearch && matchesBalance;
    });
  }, [search, patients, balanceFilter]);

  if (loading) {
    return <PageLoading label="Loading patients..." />;
  }

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <PatientHeader />

      <PatientSearch
        search={search}
        setSearch={setSearch}
        balanceFilter={balanceFilter}
        setBalanceFilter={setBalanceFilter}
      />

      <PatientList
        patients={filteredPatients}
        setPatients={setPatients}
        error={error}
        title={balanceFilter === "unpaid" ? "Patients with outstanding balance" : "All Patients"}
      />
    </Box>
  );
}
