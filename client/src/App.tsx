import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SigupPage";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import DashboardHome from "./pages/DashboardHome";
import TeamMembers from "./pages/TeamMembers";
import { Toaster } from "./components/ui/sonner";
import { InputOTPForm } from "./components/OtpVerification/otp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<InputOTPForm />} />
        <Route path="/dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="team" element={<TeamMembers />} />
          <Route path="projects" element={<div className="p-6"><h1 className="text-3xl font-bold">Projects</h1><p className="text-muted-foreground">Manage your projects here</p></div>} />
          <Route path="analytics" element={<div className="p-6"><h1 className="text-3xl font-bold">Analytics</h1><p className="text-muted-foreground">View your analytics here</p></div>} />
        </Route>
      </Routes>
      <Toaster richColors />
    </BrowserRouter>
  );
}

export default App;
