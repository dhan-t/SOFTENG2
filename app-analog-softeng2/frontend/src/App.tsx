import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard-page/Dashboard";
import LogisticsPage from "./pages/logistics-page/Logistics";
import ReportPage from "./pages/reports-page/ReportsPage";
import TrackingDashboard from "./pages/tracking-page/TrackingDashboard";
import LoginPage from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page/Register";
import ProductionData from "./pages/production-page/ProductionData";
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