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
import LineChartComponent from "../test page/test";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

// ✅ Tracking stuff
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];
const trackingData = [
  {
    requestId: "67a0cd1c7d91f9034db6609a",
    module: "CAM-001",
    requestedBy: "Alice",
    recipient: "Factory A",
    status: "Pending",
    requestDate: "2023-10-01",
    completionDate: null,
    quantity: 100,
  },
  {
    requestId: "67a0de107d91f9034db6609d",
    module: "SPK-001",
    requestedBy: "Bob",
    recipient: "Factory B",
    status: "Completed",
    requestDate: "2023-10-02",
    completionDate: "2023-10-05",
    quantity: 50,
  },
  {
    requestId: "67a43839827bcb4539f0163a",
    module: "HOS-001",
    requestedBy: "Charlie",
    recipient: "Factory C",
    status: "In Transit",
    requestDate: "2023-10-03",
    completionDate: null,
    quantity: 200,
  },
  {
    requestId: "67a441fd827bcb4539f0163d",
    module: "SCR-1",
    requestedBy: "David",
    recipient: "Factory D",
    status: "Pending",
    requestDate: "2023-10-04",
    completionDate: null,
    quantity: 150,
  },
  {
    requestId: "67a441fd827bcb4539f0163e",
    module: "BTN-001",
    requestedBy: "Eve",
    recipient: "Factory E",
    status: "Completed",
    requestDate: "2023-10-05",
    completionDate: "2023-10-07",
    quantity: 75,
  },
  {
    requestId: "67a441fd827bcb4539f0163f",
    module: "CHP-001",
    requestedBy: "Frank",
    recipient: "Factory F",
    status: "Pending",
    requestDate: "2023-10-06",
    completionDate: null,
    quantity: 120,
  },
  {
    requestId: "67a441fd827bcb4539f0163g",
    module: "STG-001",
    requestedBy: "Grace",
    recipient: "Factory G",
    status: "In Transit",
    requestDate: "2023-10-07",
    completionDate: null,
    quantity: 90,
  },
  {
    requestId: "67a441fd827bcb4539f0163h",
    module: "CAM-001",
    requestedBy: "Hannah",
    recipient: "Factory A",
    status: "Completed",
    requestDate: "2023-10-08",
    completionDate: "2023-10-10",
    quantity: 110,
  },
  {
    requestId: "67a441fd827bcb4539f0163i",
    module: "SPK-001",
    requestedBy: "Ian",
    recipient: "Factory B",
    status: "Pending",
    requestDate: "2023-10-09",
    completionDate: null,
    quantity: 60,
  },
  {
    requestId: "67a441fd827bcb4539f0163j",
    module: "HOS-001",
    requestedBy: "Jack",
    recipient: "Factory C",
    status: "Completed",
    requestDate: "2023-10-10",
    completionDate: "2023-10-12",
    quantity: 210,
  },
];
const TrackingTest: React.FC = () => {
  const statusCounts = trackingData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moduleCounts = trackingData.reduce((acc, item) => {
    acc[item.module] = (acc[item.module] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const recipientCounts = trackingData.reduce((acc, item) => {
    acc[item.recipient] = (acc[item.recipient] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const requestTrends = trackingData.reduce((acc, item) => {
    acc[item.requestDate] = (acc[item.requestDate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));
  const moduleData = Object.keys(moduleCounts).map((key) => ({
    name: key,
    value: moduleCounts[key],
  }));
  const recipientData = Object.keys(recipientCounts).map((key) => ({
    name: key,
    value: recipientCounts[key],
  }));
  const trendData = Object.keys(requestTrends).map((key) => ({
    date: key,
    requests: requestTrends[key],
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Request Status Breakdown</Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Top Requested Modules</Typography>
          <BarChart width={500} height={300} data={moduleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Request Trends Over Time</Typography>
          <LineChart width={500} height={300} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />f
            <Line type="monotone" dataKey="requests" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>
    </Box>
  );
};

// ✅ Logistics stuff
const dataLogistics = [
  {
    moduleCode: "CAM-001",
    variety: "Camera Module",
    requestedBy: "Alice",
    recipient: "Factory A",
    dateProduced: "2023-10-01",
    quantity: 100,
    status: "Pending",
  },
  {
    moduleCode: "SPK-001",
    variety: "Speaker Module",
    requestedBy: "Bob",
    recipient: "Factory B",
    dateProduced: "2023-10-02",
    quantity: 50,
    status: "Completed",
  },
  {
    moduleCode: "HOS-001",
    variety: "Housing Module",
    requestedBy: "Charlie",
    recipient: "Factory C",
    dateProduced: "2023-10-03",
    quantity: 200,
    status: "In Transit",
  },
  {
    moduleCode: "SCR-1",
    variety: "Screen Module",
    requestedBy: "David",
    recipient: "Factory D",
    dateProduced: "2023-10-04",
    quantity: 150,
    status: "Pending",
  },
  {
    moduleCode: "BTN-001",
    variety: "Button Module",
    requestedBy: "Eve",
    recipient: "Factory E",
    dateProduced: "2023-10-05",
    quantity: 75,
    status: "Completed",
  },
  {
    moduleCode: "CHP-001",
    variety: "Chip Module",
    requestedBy: "Frank",
    recipient: "Factory F",
    dateProduced: "2023-10-06",
    quantity: 120,
    status: "Pending",
  },
  {
    moduleCode: "STG-001",
    variety: "Storage Module",
    requestedBy: "Grace",
    recipient: "Factory G",
    dateProduced: "2023-10-07",
    quantity: 90,
    status: "In Transit",
  },
];

// Bar Chart
const barChartData = dataLogistics.map((item) => ({
  name: item.moduleCode,
  quantity: item.quantity,
}));

// Pie Chart
const factoryCounts = dataLogistics.reduce((acc, item) => {
  acc[item.recipient] = (acc[item.recipient] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const pieChartData = Object.keys(factoryCounts).map((key) => ({
  name: key,
  value: factoryCounts[key],
}));
const pieColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#E67373",
  "#D6A2E8",
];

// Line Chart
const requestTrendsData = dataLogistics.reduce((acc, item) => {
  acc[item.dateProduced] = (acc[item.dateProduced] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const lineChartData = Object.keys(requestTrendsData).map((key) => ({
  date: key,
  requests: requestTrendsData[key],
}));

// Main logistic code
const LogisticsTest: React.FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* ✅ Most Requested Items (Bar Chart) */}
      <Card>
        <CardContent>
          <Typography variant="h6">Most Requested Items</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ Factory Requests (Pie Chart) */}
      <Card>
        <CardContent>
          <Typography variant="h6">Factory Requests</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ Request Trends Over Time (Line Chart) */}
      <Card>
        <CardContent>
          <Typography variant="h6">Request Trends Over Time</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#ff9800" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

interface DailyQuotaProps {
  produced: number;
  target: number;
}

interface WeeklyProductionProps {
  produced: number;
  previous: number;
}

interface MonthlyPerformanceProps {
  currentMonth: number;
  previousMonth: number;
}

interface FactoryEfficiencyProps {
  efficiency: number;
}

interface YearToDateProps {
  produced: number;
  annualTarget: number;
}

interface EquipmentTrackingProps {
  tracked: number;
  inTransit: number;
}

interface EquipmentRequestsProps {
  totalRequests: number;
  pendingRequests: number;
}

interface FactoryEfficiencyProps {
  efficiency: number;
}

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

const DailyQuota: React.FC<DailyQuotaProps> = ({ produced, target }) => {
  const progress = (produced / target) * 100;
  return (
    <Card className="smaller-components">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Daily Quota
        </Typography>
        <Typography variant="h4" color="primary">
          {progress.toFixed(1)}% Completed
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {produced} of {target} units
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </CardContent>
    </Card>
  );
};

const WeeklyProduction: React.FC<WeeklyProductionProps> = ({
  produced,
  previous,
}) => {
  const difference = produced - previous;
  const isPositive = difference >= 0;
  const percentageChange = ((difference / previous) * 100).toFixed(1);

  return (
    <Card className="smaller-components">
      {" "}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weekly Production Rate
        </Typography>
        <Typography variant="h4" color="primary">
          {produced} units
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          {isPositive ? (
            <TrendingUpIcon color="success" />
          ) : (
            <TrendingDownIcon color="error" />
          )}
          <Typography
            variant="body2"
            color={isPositive ? "green" : "red"}
            ml={1}
          >
            {percentageChange}% {isPositive ? "increase" : "decrease"}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          vs. previous week
        </Typography>
      </CardContent>
    </Card>
  );
};

const MonthlyPerformance: React.FC<MonthlyPerformanceProps> = ({
  currentMonth,
  previousMonth,
}) => {
  const difference = currentMonth - previousMonth;
  const isPositive = difference >= 0;
  const percentageChange = ((difference / previousMonth) * 100).toFixed(1);

  return (
    <Card className="smaller-components">
      {" "}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monthly Performance
        </Typography>
        <Typography variant="h4" color="primary">
          {currentMonth} units
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          {isPositive ? (
            <TrendingUpIcon color="success" />
          ) : (
            <TrendingDownIcon color="error" />
          )}
          <Typography
            variant="body2"
            color={isPositive ? "green" : "red"}
            ml={1}
          >
            {percentageChange}% {isPositive ? "increase" : "decrease"}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          vs. previous month
        </Typography>
      </CardContent>
    </Card>
  );
};

const FactoryEfficiency: React.FC<FactoryEfficiencyProps> = ({
  efficiency,
}) => {
  return (
    <Card className="smaller-components">
      {" "}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Factory Efficiency
        </Typography>
        <Typography variant="h4" color={efficiency >= 75 ? "green" : "red"}>
          {efficiency}%
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <SpeedIcon color="action" />
          <Typography variant="body2" color="textSecondary" ml={1}>
            Overall Efficiency
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const EquipmentTracking: React.FC<EquipmentTrackingProps> = ({
  tracked,
  inTransit,
}) => {
  return (
    <Card className="smaller-components">
      {" "}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Equipment Tracking
        </Typography>
        <Typography variant="h4" color="primary">
          {tracked} Tracked
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {inTransit} In Transit
        </Typography>
        <LocalShippingIcon color="action" />
      </CardContent>
    </Card>
  );
};

const EquipmentRequests: React.FC<EquipmentRequestsProps> = ({
  totalRequests,
  pendingRequests,
}) => {
  return (
    <Card className="smaller-components">
      {" "}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Equipment Requests
        </Typography>
        <Typography variant="h4" color="primary">
          {totalRequests} Total
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {pendingRequests} Pending
        </Typography>
        <AssignmentIcon color="action" />
      </CardContent>
    </Card>
  );
};

const YearToDate: React.FC<YearToDateProps> = ({ produced, annualTarget }) => {
  const progress = (produced / annualTarget) * 100;
  return (
    <Card className="smaller-components">
      {" "}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Year-to-Date Summary
        </Typography>
        <Typography variant="h4" color="primary">
          {produced} units
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Annual Target: {annualTarget} units
        </Typography>
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Typography variant="body2" color="textSecondary" mt={1}>
          {progress.toFixed(1)}% of annual target achieved
        </Typography>
      </CardContent>
    </Card>
  );
};

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

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  valueColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  icon,
  valueColor,
}) => {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" color={valueColor || "primary"}>
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {icon} {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

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
  const [view, setView] = useState("production");

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

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, newView) => setView(newView)}
        aria-label="Dashboard View"
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="all" aria-label="All">
          All
        </ToggleButton>
        <ToggleButton value="production" aria-label="Production">
          Production
        </ToggleButton>
        <ToggleButton value="logistics" aria-label="Logistics">
          Logistics
        </ToggleButton>
        <ToggleButton value="tracking" aria-label="Tracking">
          Tracking
        </ToggleButton>
      </ToggleButtonGroup>

      {view === "all" && (
        <div className="main-div">
          <div className="small-holder">
            <DailyQuota produced={94} target={100} />
            <EquipmentRequests totalRequests={12} pendingRequests={14} />
            <EquipmentTracking tracked={11} inTransit={8} />
            <FactoryEfficiency efficiency={90} />
          </div>

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
                  <h2>Production Schedule</h2>
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
      )}

      {view === "production" && (
        <div className="main-div">
          <div className="small-holder">
            <DailyQuota produced={94} target={100} />
            <WeeklyProduction produced={100} previous={90} />
            <MonthlyPerformance currentMonth={4000} previousMonth={3970} />
            <YearToDate produced={10090} annualTarget={15000} />
          </div>
          <div className="component-holder">
            <h2>Production Performance</h2>
            <LineChartComponent />
          </div>
        </div>
      )}

      {view === "logistics" && (
        <div className="main-div">
          <div className="component-holder">
            <LogisticsTest />
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
        </div>
      )}

      {view === "tracking" && (
        <div className="main-div">
          <div className="component-holder">
            <TrackingTest />
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
      )}
    </div>
  );
};

export default Dashboard;
