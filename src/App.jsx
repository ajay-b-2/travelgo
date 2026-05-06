import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Review from "./pages/Review";
import Admin from "./pages/Admin";

function AdminRoute() {
  const isAdminAuthenticated = localStorage.getItem("adminAuth") === "true";
  return isAdminAuthenticated ? <Admin /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/review" element={<Review />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
