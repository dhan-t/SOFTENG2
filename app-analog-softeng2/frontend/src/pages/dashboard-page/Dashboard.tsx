import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IconType } from "react-icons/lib";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import "./Dashboard.css";
import Header from "../components/Header";
import { FaBox, FaMapMarkerAlt, FaUser, FaClipboardList } from "react-icons/fa";

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

interface Reminder {
  date: string;
  title: string;
}

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

  const [value, setValue] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");

  const addReminder = () => {
    const formattedDate = value.toISOString().split("T")[0];
    if (reminderTitle.trim() === "") {
      alert("Reminder title cannot be empty.");
      return;
    }

    setReminders([...reminders, { date: formattedDate, title: reminderTitle }]);
    setReminderTitle("");
    setShowReminderInput(false);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const reminderForDate = reminders.find(
        (reminder) => reminder.date === formattedDate
      );
      if (reminderForDate) {
        return (
          <span
            style={{ color: "blue", fontWeight: "bold", fontSize: "0.9rem" }}
          >
            ●
          </span>
        );
      }
    }
    return null;
  };

  const handleDayHover = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const reminderForDate = reminders.find(
      (reminder) => reminder.date === formattedDate
    );
    return reminderForDate ? reminderForDate.title : null;
  };

  if (productionLoading || logisticsLoading || trackingLoading)
    return <div className="loading">Loading...</div>;
  if (productionError || logisticsError || trackingError)
    return <div className="error">Error loading data.</div>;

  const inventoryItems: SummaryItem[] = [
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

  const logisticsItems: SummaryItem[] = [
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
        {/* Left side components */}
        <div className="bigger-components">
          <div className="component-holder">
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

          <div className="component-holder">
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

          <div className="component-holder">
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
        {/* End of left side components */}

        {/* Right side components */}
        <div className="smaller-components">
          <div className="component-holder">
            <SummaryCard title="Inventory Summary" items={inventoryItems} />
          </div>
          <div className="component-holder">
            <SummaryCard title="Logistics Summary" items={logisticsItems} />
          </div>
          <div className="component-holder">
            <h2>Production Schedule</h2>

            <div className="calendar-dashboard">
              <Calendar
                className={"calendar"}
                onChange={(date) => setValue(date as Date)}
                value={value}
                tileContent={tileContent}
                tileClassName={({ date }) => {
                  const formattedDate = date.toISOString().split("T")[0];
                  const hasReminder = reminders.some(
                    (reminder) => reminder.date === formattedDate
                  );
                  return hasReminder ? "reminder-day" : null;
                }}
              />
              <div className="add-reminder">
                <button
                  onClick={() => setShowReminderInput(!showReminderInput)}
                >
                  {showReminderInput ? "Cancel" : "Add Reminder"}
                </button>
              </div>
              {showReminderInput && (
                <div className="reminder-input">
                  <input
                    type="text"
                    placeholder="Reminder Title"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                  />
                  <button onClick={addReminder}>Save</button>
                </div>
              )}
              <div className="selected-date-info">
                <strong>Selected Date:</strong> {value.toDateString()}
                <br />
                <strong>Reminder:</strong>{" "}
                {handleDayHover(value) || "No reminder"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
