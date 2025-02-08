import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard-page/Dashboard";
import LogisticsPage from "./pages/module-requests-page/ModuleRequests";
import ReportPage from "./pages/report-generation-page/ReportsPage";
import TrackingDashboard from "./pages/logistics-tracking-page/TrackingDashboard";
import LoginPage from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page/Register";
import ProductionData from "./pages/production-reports-page/ProductionData";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/production" element={<ProductionData />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/tracking" element={<TrackingDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
