import "./App.css";


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";



import Login from "./Components/Login";


import DentistDashboard from "./Pages/DentistDashboard";

import Appointments from "./Pages/Appointments";
import AddPatient from "./Components/AddPatient";

import NewAppointment from "./Pages/NewAppointment";

import Patients from "./Pages/Patients";

import PatientProfile from "./Components/PatientProfile";

import Treatments from "./Pages/Treatments";

import AddTreatment from "./Components/AddTreatment";


import MainLayout from "./Layout/MainLayout";





function App(){


return (


<div className="App">


<BrowserRouter>


<Routes>





{/* LOGIN */}


<Route

path="/"

element={<Login />}

/>







{/* MAIN APP WITH SIDEBAR */}


<Route element={<MainLayout />}>





<Route

path="/dashboard"

element={<DentistDashboard />}

/>







<Route

path="/appointments"

element={<Appointments />}

/>



<Route
 path="/patients/add"
 element={<AddPatient />}
/>



<Route

path="/appointments/new"

element={<NewAppointment />}

/>







<Route

path="/patients"

element={<Patients />}

/>








{/* ADD TREATMENT - BEFORE PATIENT PROFILE */}

<Route

path="/patients/:id/add-treatment"

element={<AddTreatment />}

/>






<Route

path="/patients/:id"

element={<PatientProfile />}

/>







<Route

path="/treatments"

element={<Treatments />}

/>





</Route>









<Route

path="*"

element={<Navigate to="/dashboard" />}

/>





</Routes>


</BrowserRouter>


</div>


);


}


export default App;