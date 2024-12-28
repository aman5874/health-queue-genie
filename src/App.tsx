import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HospitalSelection from "./pages/HospitalSelection";
import Appointments from "./pages/Appointments";
import BookAppointment from "./pages/BookAppointment.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/hospital-selection" 
          element={
            <ProtectedRoute>
              <HospitalSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/book-appointment" 
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;