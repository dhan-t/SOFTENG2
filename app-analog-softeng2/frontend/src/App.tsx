import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login-page/Login";
import RegisterPage from "./pages/register-page/Register";
import Dashboard from "./pages/1_dashboard/Dashboard";
import WorkOrder from "./pages/2_work-order/WorkOrder";
import TrackRequest from "./pages/3_track-request/TrackRequest";
import RequestModule from "./pages/4_request-module/RequestModule";
import ReportProduction from "./pages/5_report-production/ReportProduction";
import NotificationPage from "./pages/notification-page/Notification";
import Profile from "./pages/profile-page/Profile";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workorder" element={<WorkOrder />} />
          <Route path="/trackrequest" element={<TrackRequest />} />
          <Route path="/requestmodule" element={<RequestModule />} />
          <Route path="/reportproduction" element={<ReportProduction />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
