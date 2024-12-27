import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Appointments from "./pages/Appointments";
import HospitalSelection from "./pages/HospitalSelection";
import TestCategories from "./pages/TestCategories";
import AdminDashboard from "./pages/admin/Dashboard";
import ReceptionistDashboard from "./pages/receptionist/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/hospitals" element={<AppLayout><HospitalSelection /></AppLayout>} />
          <Route path="/categories" element={<AppLayout><TestCategories /></AppLayout>} />
          <Route path="/appointments" element={<AppLayout><Appointments /></AppLayout>} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/receptionist/*" element={<ReceptionistDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;