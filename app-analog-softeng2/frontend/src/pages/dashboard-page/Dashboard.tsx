import React from "react";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import "./Dashboard.css";

const Dashboard = () => {
  const {
    productionData,
    loading: productionLoading,
    error: productionError,
  } = useProductionData();
  const {
    requests,
    loading: logisticsLoading,
    error: logisticsError,
  } = useLogistics();
  const {
    trackingLogs,
    loading: trackingLoading,
    error: trackingError,
  } = useTracking();

  if (productionLoading || logisticsLoading || trackingLoading)
    return <div className="loading">Loading...</div>;
  if (productionError || logisticsError || trackingError)
    return <div className="error">Error loading data.</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Production Summary */}
      <div className="section">
        <h2>Production Summary</h2>
        <div className="chart">
          {/* Bar Chart for Production Data */}
          <div className="bar-chart">
            {productionData.length > 0 ? (
              productionData.map((item) => (
                <div
                  key={item.productId}
                  className="bar"
                  style={{ height: `${item.quantityProduced * 2}px` }} // Scale height for better visibility
                >
                  <span>{item.productName}</span>
                  <span>{item.quantityProduced}</span>
                </div>
              ))
            ) : (
              <p>No production data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Logistics Summary */}
      <div className="section">
        <h2>Logistics Summary</h2>
        <div className="chart">
          {/* Pie Chart for Logistics Data */}
          <div className="pie-chart">
            {requests.map((item) => (
              <div
                key={item._id}
                className="slice"
                style={{
                  backgroundColor: `#${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`,
                }}
              >
                <span>{item.module}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracking Summary */}
      <div className="section">
        <h2>Tracking Summary</h2>
        <ul className="tracking-logs">
          {trackingLogs.map((log) => (
            <li key={log.logId}>
              <span className="module">{log.module}</span>: {log.status}{" "}
              (Updated by {log.updatedBy} on{" "}
              {new Date(log.updatedAt).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
