import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/1_dashboard/Dashboard";
import LogisticsPage from "./pages/3_equipment-request/ModuleRequests";
import ReportPage from "./pages/5_report-generation/ReportsPage";
import TrackingDashboard from "./pages/4_logistics-tracking/TrackingDashboard";
import LoginPage from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page/Register";
import NotificationPage from "./pages/notification-page/Notification";
import ProductionData from "./pages/2_production-reports/ProductionData";
import ProfilePage from "./pages/profile-page/Profile";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/production" element={<ProductionData />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/tracking" element={<TrackingDashboard />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* Add the Profile route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;