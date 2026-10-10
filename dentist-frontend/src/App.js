import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Components/Login";

import DentistDashboard from "./Pages/DentistDashboard";

import Appointments from "./Pages/Appointments";
import AddPatient from "./Components/AddPatient";
import AppointmentWhatsapp from "./Pages/AppointmentWhatsapp";

import NewAppointment from "./Pages/NewAppointment";

import Patients from "./Pages/Patients";
import WhatsAppReminders from "./Pages/WhatsAppReminders";
import AppointmentDetails from "./Pages/AppointmentDetails";
import PatientProfile from "./Components/PatientProfile";

import Treatments from "./Pages/Treatments";
import CleaningWhatsapp from "./Pages/CleaningWhatsapp";

import AddTreatment from "./Components/AddTreatment";

import MainLayout from "./Layout/MainLayout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public login page */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DentistDashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/cleaningWhatsapp/:id" element={<CleaningWhatsapp />} />
              <Route path="/patients/add" element={<AddPatient />} />
              <Route path="/appointments/new" element={<NewAppointment />} />
              <Route path="/appointmentWhatsapp/:id" element={<AppointmentWhatsapp />} />
              <Route path="/whatsapp" element={<WhatsAppReminders />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id/add-treatment" element={<AddTreatment />} />
              <Route path="/patients/:id" element={<PatientProfile />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/appointmentDetails/:id" element={<AppointmentDetails />} />
            </Route>
          </Route>

          {/* Unknown URLs */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
