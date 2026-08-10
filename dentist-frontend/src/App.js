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
import Patients from "./Pages/Patients";


function App() {

    return (

        <div className="App">

            <BrowserRouter>

                <Routes>

                    {/* Login */}

                    <Route
                        path="/"
                        element={<Login />}
                    />


                    {/* Dashboard */}

                    <Route
                        path="/dashboard"
                        element={<DentistDashboard />}
                    />


                    {/* Appointments */}

                    <Route
                        path="/appointments"
                        element={<Appointments />}
                    />


                    {/* Patients */}

                    <Route
                        path="/patients"
                        element={<Patients />}
                    />


                    {/* Fallback */}

                    <Route
                        path="*"
                        element={
                            <Navigate to="/dashboard" />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </div>

    );
}


export default App;