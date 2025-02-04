import React from "react";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import { useReports } from "../../hooks/useReports";
import "./ReportsPage.css";

const ReportsPage = () => {
  const { productionData } = useProductionData();
  const { requests: logisticsData } = useLogistics();
  const { trackingLogs: trackingData } = useTracking();
  const { generateReport, loading, error } = useReports();

  const handleGenerateReport = async () => {
    await generateReport(productionData, logisticsData, trackingData);
  };

  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <button onClick={handleGenerateReport} disabled={loading}>
        {loading ? "Generating..." : "Generate Report"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ReportsPage;
