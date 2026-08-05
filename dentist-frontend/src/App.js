import logo from "./logo.svg";
import "./App.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import DentistDashboard from "./Pages/DentistDashboard";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DentistDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
