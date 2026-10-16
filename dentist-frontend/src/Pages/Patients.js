import { Box } from "@mui/material";

import PatientHeader from "../Components/PatientHeader";
import PatientSearch from "../Components/PatientSearch";
import PatientList from "../Components/PatientList";
import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);

  const [filteredPatients, setFilteredPatients] = useState([]);

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [error, setError] = useState("");

  useEffect(() => {
    const getPatients = async () => {
      try {
        const fetchApi = await fetch(`${process.env.REACT_APP_API_URL}/api/patients`);

        if (!fetchApi.ok) {
          setError("Data not Found");

          return;
        }

        const response = await fetchApi.json();

        setPatients(response);
        console.log(response);
        setFilteredPatients(response);
      } catch (error) {
        console.log(error);

        setError("Connection Error");
      }
    };

    getPatients();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    const result = patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const id = p.id?.toString() || "";
      return fullName.includes(value) || id.includes(value);
    });

    setFilteredPatients(result);
  }, [search, patients]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {error && <h3>{error}</h3>}

      <PatientHeader />

      <PatientSearch search={search} setSearch={setSearch} />

      <PatientList patients={filteredPatients} setPatients={setPatients} />
    </Box>
  );
}
