import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IconType } from "react-icons/lib";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import "./Dashboard.css";
import Header from "../components/Header";
import { FaBox, FaTruck, FaUser, FaClipboardList } from "react-icons/fa";
import LineChartComponent from "../test page/test";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { AssignmentTurnedIn } from "@mui/icons-material";
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
  Chip,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useReports } from "../../hooks/useReports";

// ✅ Small components stuff
interface CardProps {
  type: "progress" | "rate" | "summary";
  title: string;
  currentValue?: number;
  maxValue?: number;
  oldValue?: number;
  description?: string;
}

const GenerateReport = () => {
  const { productionData } = useProductionData();
  const { requests: logisticsData } = useLogistics();
  const { trackingLogs: trackingData } = useTracking();
  const { generateReport, loading, error } = useReports();

  const handleGenerateReport = async () => {
    await generateReport(productionData, logisticsData, trackingData);
  };

  return (
    <div>
      <button
        className="generate-button"
        onClick={handleGenerateReport}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Report"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

const UnifiedCard: React.FC<CardProps> = ({
  type,
  title,
  currentValue = 0,
  maxValue = 0,
  oldValue = 0,
  description = "",
}) => {
  const difference = currentValue - oldValue;
  const isPositive = difference >= 0;
  const percentageChange =
    oldValue !== 0 ? ((difference / oldValue) * 100).toFixed(1) : "0";

  // ✅ Dynamically select icon & color (Only for "rate" cards)
  const IconComponent = isPositive ? TrendingUp : TrendingDown;
  const iconColor = isPositive ? "green" : "red";
 
  {
    /* Small dashboard component builder*/
  }
  return (
    <div className={`small-dashboard-card ${type}-card`}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "fit-content",
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            flex: 7,
            width: "fill-container",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            className="card-title"
            sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
          >
            {title}
          </Typography>
          <Typography variant="h4" color="primary" className="card-value">
            {currentValue}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="card-units"
            sx={{ fontSize: ".8rem" }}
          >
            {type === "rate" ? "vs. previous value" : description}
          </Typography>
        </Box>

        {/* ✅ Right Side: Show only if "rate" type */}
        {type === "rate" && (
          <Box
            sx={{
              
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", // ✅ Center vertically
              width: "100%", // ✅ Ensure full width
              height: "100%", // ✅ Ensure full height
              mt: 5,
              
              
            }}
          >
            {/* ✅ Dynamic Icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start", // Moves only the icon up/down without shifting other content
                position: "relative", // Allows independent movement
                top: 85, // Moves the icon up
                right: 115
              }}
            >
              <IconComponent 
                sx={{ 
                  fontSize: "4rem", 
                  color: iconColor, 
                  mt: -10}} />
            </Box>

            {/* ✅ Percentage Change */}
            <Chip
              label={`${percentageChange}%`}
              sx={{
                fontSize: "1rem",
                backgroundColor: isPositive ? "green" : "red",
                color: "white",
                fontWeight: "bold",
                mr: 50,
                mt: 10,
              }}
            />
          </Box>
        )}
      </CardContent>

      {/* ✅ Progress Bar for "progress" type */}
      {type === "progress" && (
        <Box sx={{ width: "100%", mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={(currentValue / maxValue) * 100}
            sx={{
              marginLeft: 2,
              marginRight: 2,
            }}
          />
        </Box>
      )}
    </div>
  );
};

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

const Heatmap = () => {
  const { productionData, loading, error } = useProductionData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (productionData.length === 0) return <p>No production data available.</p>;

  // Calculate max value for normalization
  const maxProduced = Math.max(
    ...productionData.map((item) => item.quantityProduced),
    1
  );

  return (
    <div className="heatmap">
      {[...productionData] // Create a copy to avoid modifying the original array
        .reverse() // Reverse the order so the latest push is first
        .map((item) => {
          const intensity = (item.quantityProduced / maxProduced) * 255;
          return (
            <div
              key={item.productId}
              className="heatmap-cell"
              style={{
                backgroundColor: `rgb(${255 - intensity}, ${
                  255 - intensity
                }, 255)`, // Blue scale
              }}
            >
              <span className="product-name">{item.productName}</span>
              <span className="product-quantity">{item.quantityProduced}</span>
            </div>
          );
        })}
    </div>
  );
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, items }) => (
  <div className="small-card">
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
  const [view, setView] = useState("all");

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
      label: "Finished units",
      iconBgColor: "#FFF4E5",
      iconColor: "#FFA500",
    },
    {
      icon: FaTruck,
      value: 200,
      label: "To be shipped",
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
        sx={{ display: "flex",
          justifyContent: "flex-start", // Aligns buttons to the left
          alignItems: "center", // Centers vertically
          backgroundColor: "#fff",
          borderRadius: "30px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
          padding: "7px",
          paddingLeft: "12px",
          gap: "7px",
          width: "100%",
         }}
      >
        <ToggleButton 
        value="all" 
        aria-label="All"
        sx={{
          color: "#444", 
          fontWeight: 600, 
          fontFamily: "'Poppins', sans-serif", 
          borderRadius: "17px!important", 
          backgroundColor: "#f8f9fa", 
          fontSize: "0.8rem", 
          padding: "6px 14px", 
          minWidth: "auto",
          height: "32px", 
          overflow: "hidden",
          transition: "all 0.2s ease-in-out", 
          "&:hover": {
            backgroundColor: "#e2e6ea", 
          },
          "&.Mui-selected, &.Mui-focusVisible": {
            backgroundColor: "#261cc9",
            color: "white",
            boxShadow: "0px 2px 8px rgba(0, 123, 255, 0.4)", 
          },
        }}
      >
          All
        </ToggleButton>
        <ToggleButton 
        value="production" 
        aria-label="Production"
        sx={{
          color: "#444", 
          fontWeight: 600, 
          fontFamily: "'Poppins', sans-serif", 
          borderRadius: "17px!important", 
          backgroundColor: "#f8f9fa", 
          fontSize: "0.8rem", 
          padding: "6px 14px", 
          minWidth: "auto",
          height: "32px", 
          overflow: "hidden",
          transition: "all 0.2s ease-in-out", 
          "&:hover": {
            backgroundColor: "#e2e6ea", 
          },
          "&.Mui-selected, &.Mui-focusVisible": {
            backgroundColor: "#261cc9",
            color: "white",
            boxShadow: "0px 2px 8px rgba(0, 123, 255, 0.4)", 
          },
        }}
        >
          Production
        </ToggleButton>
        <ToggleButton 
        value="logistics" 
        aria-label="Requests"
        sx={{
          color: "#444", 
          fontWeight: 600, 
          fontFamily: "'Poppins', sans-serif", 
          borderRadius: "17px!important", 
          backgroundColor: "#f8f9fa", 
          fontSize: "0.8rem", 
          padding: "6px 14px", 
          minWidth: "auto",
          height: "32px", 
          overflow: "hidden",
          transition: "all 0.2s ease-in-out", 
          "&:hover": {
            backgroundColor: "#e2e6ea", 
          },
          "&.Mui-selected, &.Mui-focusVisible": {
            backgroundColor: "#261cc9",
            color: "white",
            boxShadow: "0px 2px 8px rgba(0, 123, 255, 0.4)", 
          },
        }}
        >
          Modules
        </ToggleButton>
        <ToggleButton
          value="tracking"
          aria-label="Tracking"
          sx={{
            color: "#444", 
          fontWeight: 600, 
          fontFamily: "'Poppins', sans-serif", 
          borderRadius: "17px!important",
          backgroundColor: "#f8f9fa", 
          fontSize: "0.8rem", 
          padding: "6px 14px", 
          minWidth: "auto",
          height: "32px", 
          overflow: "hidden",
          transition: "all 0.2s ease-in-out", 
          "&:hover": {
            backgroundColor: "#e2e6ea", 
          },
          "&.Mui-selected, &.Mui-focusVisible": {
            backgroundColor: "#261cc9",
            color: "white",
            boxShadow: "0px 2px 8px rgba(0, 123, 255, 0.4)", 
            },
          }}
        >
          Tracking
        </ToggleButton>
        <GenerateReport />
      </ToggleButtonGroup>

      {/* top cards*/}
      {view === "all" && (
        <div className="main-div"> 
          <div className="small-holder"> 
          <Box sx={{ 
            boxShadow: "0px 10px 20px 0px rgba(133, 133, 133, 0.1)", 
            borderRadius: 6, 
            p: 1, 
            backgroundColor: "white", 
            minWidth: "220px", 
            minHeight: "150px", }}>

            <UnifiedCard
              type="progress"
              title={
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "flex-start", // to the top
                    alignSelf: "flex-start", // same height as text
                    fontFamily: "Poppins, sans-serif", // Ensures the title also uses Poppins
                    fontWeight: 600, // Optional: Makes it stand out
                    whiteSpace: "nowrap", // Prevents text from wrapping to a new line
                    overflow: "hidden", // Ensures no extra spacing issues
                    fontSize: "1.05rem",
                    color: "#09194f",
                  }}
                >
                  <AssignmentTurnedIn sx={{ fontSize: "1.3rem", mr: 6, mt: .5, color: "#0f38bf",}} />
                  Daily Quota
                </Typography>
              }
              currentValue={
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "2.5rem",
                    mt: 5,
                    
                    mb: -1.3,
                  }}
                >
                  94
                </Typography>
              }
              maxValue={100}
            />
            </Box>

            <Box
            sx={{
              boxShadow: "0px 10px 20px 0px rgba(133, 133, 133, 0.1)",
              borderRadius: 6,
              p: 0.7,
              backgroundColor: "white",
              minWidth: "280px",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column", // Makes sure children are stacked vertically
              justifyContent: "space-between", // Pushes description to the bottom
            }}
          >
            <UnifiedCard
              type="summary"
              title={
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "flex-start", // Aligns icon and text properly
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "1rem",
                    color: "#09194f",
                    mt: 1,
                  }}
                >
                  <AssignmentTurnedIn
                    sx={{ fontSize: "1.3rem", mr: 4, color: "#0f38bf" }}
                  />
                  Unresolved Requests
                </Typography>
              }
              currentValue={
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "2.5rem",
                    mt: 5,
                    ml: 1,
                  }}
                >
                  10
                </Typography>
              }
              description={
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.85rem",
                    color: "#6b7280", // Soft gray color
                    textAlign: "left",
                    ml: 1,
                  }}
                >
                  Total revenue for the month
                </Typography>
              }
            />
          </Box>

            <Box
              sx={{
              boxShadow: "0px 10px 20px 0px rgba(133, 133, 133, 0.1)",
              borderRadius: 6,
              p: 0.7,
              backgroundColor: "white",
              width: "350px", // Set a fixed width
              maxWidth: "260px",
              minHeight: "150px",
              display: "flex",
              flexDirection: "column", // Makes sure children are stacked vertically
              justifyContent: "space-between", // Pushes description to the bottom
              flexShrink: 0, // Prevents resizing due to content
              }}
            >
            <UnifiedCard
              type="rate"
              title={
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "flex-start", // Aligns icon and text properly
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "1.1rem",
                    color: "#09194f",
                    mt: 1,
                    mr: 6
                  }}
                >
                  <AssignmentTurnedIn sx={{ fontSize: "1.3rem", mr: 8, color: "#0f38bf" }} />
                  Weekly Trend
                  
                </Typography>
              }
              currentValue={
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "2.5rem",
                    mt: 5,
                    ml: 1,
                  }}
                >
                  90
                </Typography>
              }
              oldValue={120}
            />
            </Box>

            <Box
              sx={{
                boxShadow: "0px 10px 20px 0px rgba(133, 133, 133, 0.1)",
                borderRadius: 6,
                p: .5,
                backgroundColor: "white",
              }}
            >
            <UnifiedCard
              type="summary"
              title={
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Poppins, sans-serif",                     		    
                    fontWeight: 600,                   
		                }}
                >
                  <AssignmentTurnedIn sx={{ mr: 7 }} />
                  Monthly Revenue
                </Typography>
              }
              currentValue={
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500, // Medium weight for numbers
                    fontSize: "2rem", // Adjust size for visibility
                    marginTop: "20px",
                  }}
                >
                  5000
                </Typography>
              }
              description="Total revenue for the month"
            />
            </Box>
          </div>

          <div className="dashboard-contents">
            {/* Left side components */}
            <div className="bigger-components">
              <div className="component-holder">
                <h2>Production feed</h2>
                <div className="chart">
                  <Heatmap />
                </div>
              </div>

              <div className="component-holder">
                <h2>Recent requests</h2>
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
                <h2>Shipping updates</h2>
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
            <UnifiedCard
              type="progress"
              title="Items produced today"
              currentValue={94}
              maxValue={100}
            />
            <UnifiedCard
              type="summary"
              title="Unresolved production issues"
              currentValue={10}
              description="Total revenue for the month"
            />
            <UnifiedCard
              type="rate"
              title="Production Performance"
              currentValue={90}
              oldValue={120}
            />
            <UnifiedCard
              type="summary"
              title="Revenue from produced items"
              currentValue={5000}
              description="Total revenue for the month"
            />
          </div>

          <div className="dashboard-contents">
            <div className="bigger-components">
              <div id="linechart-70" className="component-holder">
                <h2>Production Performance</h2>
                <LineChartComponent />
              </div>
            </div>
            <div className="smaller-components">
              <div className="component-holder">
                <SummaryCard title="Logistics Summary" items={logisticsItems} />
              </div>
            </div>
          </div>
          <div className="component-holder">
            <h2>Production feed</h2>
            <div id="full-width-heatmap" className="chart">
              <Heatmap />
            </div>
          </div>
        </div>
      )}

      {view === "logistics" && (
        <div className="main-div">
          <div className="small-holder">
            <UnifiedCard
              type="progress"
              title="Components delivered today"
              currentValue={94}
              maxValue={100}
            />
            <UnifiedCard
              type="summary"
              title="Open missing component requests"
              currentValue={10}
              description="Total revenue for the month"
            />
            <UnifiedCard
              type="rate"
              title="Components requested trend"
              currentValue={90}
              oldValue={120}
            />
            <UnifiedCard
              type="summary"
              title="Cost of missing components"
              currentValue={5000}
              description="Total revenue for the month"
            />
          </div>
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

      {/* Tracking will be removed in prod
      {view === "tracking" && (
        <div className="main-div">
          <div className="small-holder">
            <UnifiedCard
              type="progress"
              title="Modules updated today"
              currentValue={94}
              maxValue={100}
            />
            <UnifiedCard
              type="summary"
              title="Requests pending update"
              currentValue={10}
              description="Total revenue for the month"
            />
            <UnifiedCard
              type="rate"
              title="Status updates vs. last week"
              currentValue={90}
              oldValue={120}
            />
            <UnifiedCard
              type="summary"
              title="Financial impact of delays"
              currentValue={5000}
              description="Total revenue for the month"
            />
          </div>
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

      )}*/}
    </div>
  );
};

export default Dashboard;
