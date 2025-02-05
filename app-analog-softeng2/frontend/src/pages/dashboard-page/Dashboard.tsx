import React from "react";
import { IconType } from "react-icons/lib";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import "./Dashboard.css";
import Header from "../components/Header";
import { FaBox, FaMapMarkerAlt, FaUser, FaClipboardList } from "react-icons/fa";

// ✅ Define SummaryCard Props Interface
interface SummaryItem {
  icon: IconType;
  value: number;
  label: string;
  iconBgColor: string;
  iconColor: string;
}

interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
  linkText?: string;
  onLinkClick?: () => void;
}

// ✅ SummaryCard Component
const SummaryCard: React.FC<SummaryCardProps> = ({ title, items }) => (
  <div className="summary-card">
    <div className="summary-header">
      <h2>{title}</h2>
    </div>
    <div className="summary-content">
      {items.map((item, index) => (
        <div className="summary-item" key={index}>
          <div
            className="icon-container"
            style={{ backgroundColor: item.iconBgColor }}
          >
            <item.icon className="icon" style={{ color: item.iconColor }} />
          </div>
          <p className="value">{item.value}</p>
          <p className="label">{item.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// ✅ Dashboard Component
const Dashboard: React.FC = () => {
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

  // ✅ Define Summary Data
  const inventoryItems = [
    {
      icon: FaBox,
      value: 868,
      label: "Quantity in Hand",
      iconBgColor: "#FFF4E5",
      iconColor: "#FFA500",
    },
    {
      icon: FaMapMarkerAlt,
      value: 200,
      label: "To be received",
      iconBgColor: "#EEF3FF",
      iconColor: "#5A78F0",
    },
  ];

  const logisticsItems = [
    {
      icon: FaUser,
      value: 31,
      label: "Number of Suppliers",
      iconBgColor: "#E6F7FF",
      iconColor: "#00A3FF",
    },
    {
      icon: FaClipboardList,
      value: 21,
      label: "Number of Categories",
      iconBgColor: "#F6F2FF",
      iconColor: "#A461D8",
    },
  ];

  return (
    <div className="main-div">
      <Header />

      <div className="dashboard-contents">
        <div className="bigger-components">
          {/* ✅ Production Summary */}
          <div className="section">
            <h2>Production Summary</h2>
            <div className="chart">
              <div className="bar-chart">
                {productionData.length > 0 ? (
                  productionData.map((item) => (
                    <div
                      key={item.productId}
                      className="bar"
                      style={{ height: `${item.quantityProduced * 2}px` }}
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

          {/* ✅ Logistics Summary */}
          <div className="section">
            <h2>Logistics Summary</h2>
            <div className="chart">
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

          {/* ✅ Tracking Summary */}
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

        {/* ✅ Inventory & Logistics Summary Cards */}
        <div className="smaller-components">
          <SummaryCard title="Inventory Summary" items={inventoryItems} />
          <SummaryCard title="Logistics Summary" items={logisticsItems} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
