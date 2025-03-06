import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useProductionData } from "../../hooks/useProductionData";
import { useLogistics } from "../../hooks/useLogistics";
import { useTracking } from "../../hooks/useTracking";
import { useWorkOrders } from "../../hooks/useWorkOrder";
import "./Dashboard.css";
import Header from "../components/Header";
import LineChartComponent from "../tables/LineChartComponent"; // Update the import path if necessary
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { AssignmentTurnedIn } from "@mui/icons-material";
import "../components/global.css";
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
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useReports } from "../../hooks/useReports";
import { SvgIconComponent } from "@mui/icons-material";
import { Home as HomeIcon } from "@mui/icons-material";
import ProductionTable from "../tables/ProductionTable";
import ModulesTable from "../tables/ModulesTable";

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

const DynamicLineChart: React.FC = () => {
  const [data, setData] = useState<{ name: string; produced: number }[]>([]);
  const [inputValue, setInputValue] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseFloat(e.target.value));
  };

  const handleAddData = () => {
    const newData = { name: `Point ${data.length + 1}`, produced: inputValue };
    setData([...data, newData]);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter produced value"
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleAddData}>Add Data</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="produced" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Small dashboard cards
interface UnifiedCardProps {
  type: "rate" | "progress" | "summary";
  title: string;
  icon?: React.ReactNode; // Icon Component
  currentValue: number;
  maxValue?: number; // Required for "progress" type
  oldValue?: number; // Required for "rate" type
  description?: string;
}
// ✅ Small dashboard cards
const UnifiedCard: React.FC<UnifiedCardProps> = ({
  type,
  title,
  currentValue,
  maxValue = 100,
  oldValue = 0,
  description = "",
  icon,
}) => {
  // Round off values to 2 decimal places
  const roundedCurrentValue = currentValue.toFixed(2);
  const roundedOldValue = oldValue.toFixed(2);

  // Define iconColor based on the rate change
  const percentageChange = ((currentValue - oldValue) / oldValue) * 100;
  const iconColor = percentageChange > 0 ? "#4caf50" : "#f44336";

  return (
    <Card
      sx={{
        boxShadow: "0px 10px 20px 0px rgba(133, 133, 133, 0.1)",
        borderRadius: 5,
        padding: 2,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Title & Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#09194f",
              textAlign: "left",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Rate Indicator */}
        {type === "rate" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 500, fontSize: "3rem" }}
            >
              {roundedCurrentValue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {icon && React.cloneElement(icon as React.ReactElement, { sx: { fontSize: "3rem", color: iconColor } })}
              <Chip
                label={`${percentageChange}%`}
                sx={{ backgroundColor: iconColor, color: "white", mt: 0.5 }}
              />
            </Box>
          </Box>
        )}

        {/* Text for "summary" type */}
        {type === "summary" && description && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 500, fontSize: "3rem" }}
            >
              {roundedCurrentValue}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Progress Bar for "progress" type */}
      {type === "progress" && (
        <Box
          sx={{
            alignItems: "top",
            justifyContent: "space-between",
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontWeight: 500, fontSize: "3rem" }}
          >
            {roundedCurrentValue}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentValue / maxValue) * 100}
          />
        </Box>
      )}
    </Card>
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
  const completedShipments = trackingData.filter(
    (item) => item.status === "Completed"
  );

  const statusCounts = completedShipments.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const moduleCounts = completedShipments.reduce((acc, item) => {
    acc[item.module] = (acc[item.module] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const recipientCounts = completedShipments.reduce((acc, item) => {
    acc[item.recipient] = (acc[item.recipient] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const requestTrends = completedShipments.reduce((acc, item) => {
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
          <Typography variant="h6">Shipments Completed</Typography>
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
            <Legend />
            <Line type="monotone" dataKey="requests" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>
    </Box>
  );
};

// ✅ Module Barchart
const fetchBarChartData = (
  apiUri: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  useEffect(() => {
    fetch(apiUri)
      .then((res) => res.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching bar chart data:", err));
  }, [apiUri]);
};

// ✅ Module Barchart component
const CustomBarChart: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [barChartData, setBarChartData] = useState<
    { name: string; value: number }[]
  >([]);

  fetchBarChartData(apiUri, setBarChartData);

  // Function to calculate bar chart summary
  const getBarChartSummary = (data: { name: string; value: number }[]) => {
    if (data.length === 0) return "No data available.";

    // Find the category with the highest value
    const highestValue = data.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );

    // Find the category with the lowest value
    const lowestValue = data.reduce((prev, current) =>
      prev.value < current.value ? prev : current
    );

    // Calculate total value
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    // Calculate average value
    const averageValue = totalValue / data.length;

    // Generate a summary message
    const summaryMessage = `
      The category with the highest value is "${highestValue.name}" with ${
      highestValue.value
    } items.
      The category with the lowest value is "${lowestValue.name}" with ${
      lowestValue.value
    } items.
      On average, each category has ${averageValue.toFixed(2)} items.
      Total value across all categories: ${totalValue}.
    `;

    return summaryMessage;
  };

  // Get the bar chart summary
  const summaryMessage = getBarChartSummary(barChartData);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#a10a2f" />
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <strong>Summary:</strong> {summaryMessage}
      </div>
    </div>
  );
};
// ✅ Piechart colors
const piechartCOLORS = [
  "#FFB3B3",
  "#FF9999",
  "#FF7F7F",
  "#FF6666",
  "#FF4D4D",
  "#E67373",
  "#D65C5C",
];

// ✅ Piechart component
const PieChartComponent: React.FC<{ apiUrl: string }> = ({ apiUrl }) => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error("Error fetching pie chart data:", err));
  }, [apiUrl]);

  // Function to calculate pie chart summary
  const getPieChartSummary = (data: { name: string; value: number }[]) => {
    if (data.length === 0) return "No data available.";

    // Find the largest segment
    const largestSegment = data.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );

    // Find the smallest segment
    const smallestSegment = data.reduce((prev, current) =>
      prev.value < current.value ? prev : current
    );

    // Calculate total value
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    // Calculate percentage distribution
    const percentageDistribution = data
      .map((item) => ({
        name: item.name,
        percentage: ((item.value / totalValue) * 100).toFixed(2),
      }))
      .map((item) => `${item.name}: ${item.percentage}%`)
      .join(", ");

    // Generate a summary message
    const summaryMessage = `
      The largest segment is "${largestSegment.name}" with ${largestSegment.value} items.
      The smallest segment is "${smallestSegment.name}" with ${smallestSegment.value} items.
      Total value across all segments: ${totalValue}.
      Percentage distribution: ${percentageDistribution}.
    `;

    return summaryMessage;
  };

  // Get the pie chart summary
  const summaryMessage = getPieChartSummary(chartData);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={piechartCOLORS[index % piechartCOLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <strong>Summary:</strong> {summaryMessage}
      </div>
    </div>
  );
};

const GaugeChart: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [gaugeData, setGaugeData] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    const fetchGaugeChartData = async () => {
      try {
        const res = await fetch(apiUri);
        const data = await res.json();
        setGaugeData(data);
      } catch (err) {
        console.error("Error fetching gauge chart data:", err);
      }
    };

    fetchGaugeChartData();
  }, [apiUri]);

  // ✅ Function to summarize gauge data
  const getSummary = () => {
    if (gaugeData.length === 0)
      return { total: 0, average: 0, max: null, min: null };

    const total = gaugeData.reduce((sum, item) => sum + item.value, 0);
    const average = total / gaugeData.length;
    const max = Math.max(...gaugeData.map((item) => item.value));
    const min = Math.min(...gaugeData.map((item) => item.value));

    return { total, average, max, min };
  };

  const summary = getSummary();

  return (
    <div>
      {/* ✅ Gauge Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={20}
          data={gaugeData}
        >
          <RadialBar background dataKey="value" fill="#FF4D4D" />
          <Tooltip />
          <Legend />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* ✅ Summary Display */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <h3>Summary</h3>
        <p>Total: {summary.total}</p>
        <p>Average: {summary.average.toFixed(2)}</p>
        <p>Max: {summary.max}</p>
        <p>Min: {summary.min}</p>
      </div>
    </div>
  );
};

interface Reminder {
  date: string;
  title: string;
}

interface SummaryItem {
  icon: SvgIconComponent;
  value: number;
  label: string;
  iconBgColor?: string;
  iconColor?: string;
}

const Heatmap = () => {
  const { productionData, loading, error } = useProductionData();
  const { workOrders } = useWorkOrders();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (productionData.length === 0) return <p>No production data available.</p>;

  // Merge productionData with workOrders to include phoneModel
  const mergedData = productionData.map((item) => {
    const workOrder = workOrders.find(
      (order) => order._id === item.workOrderID || order.id === item.workOrderID
    );
    return {
      ...item,
      phoneModel: workOrder?.phoneModel || workOrder?.module || "Unknown Model",
    };
  });

  // Calculate max value for normalization
  const maxProduced = Math.max(
    ...mergedData.map((item) => item.producedQty),
    1
  );

  return (
    <div className="heatmap">
      {mergedData.reverse().map((item) => {
        const intensity = (item.producedQty / maxProduced) * 500;
        return (
          <div
            key={item.workOrderID}
            className="heatmap-cell"
            style={{
              backgroundColor: `rgb(${280 - intensity / 5}, ${
                90 - intensity / 5
              }, ${130 - intensity / 3})`,
            }}
          >
            <span className="product-name">{item.phoneModel}</span>
            <span className="product-quantity">{item.producedQty}</span>
          </div>
        );
      })}
    </div>
  );
};

const createSummaryItem = (
  value: number,
  label: string,
  Icon: SvgIconComponent,
  iconBgColor: string = "#f0f0f0",
  iconColor: string = "#333"
): SummaryItem => ({
  icon: Icon,
  value,
  label,
  iconBgColor,
  iconColor,
});

const totalUnitsProducedItem = createSummaryItem(
  1000, // Example value
  "Total Units Produced",
  HomeIcon // MUI icon
);

const anotherItem = createSummaryItem(
  500, // Another value
  "Another Metric",
  HomeIcon, // Another MUI icon
  "#e0e0e0", // Custom background color
  "#555" // Custom icon color
);

// ✅ Production Barchart component
const BarChartComponent: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [barData, setBarData] = useState<{ name: string; value: number }[]>([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUri);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setBarData(data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchData();
  }, [apiUri]);

  // Function to calculate fulfillment summary
  const getFulfillmentSummary = (data: { name: string; value: number }[]) => {
    // Find the number of fulfilled and unfulfilled orders
    const fulfilled =
      data.find((item) => item.name === "Fulfilled")?.value || 0;
    const unfulfilled =
      data.find((item) => item.name === "Unfulfilled")?.value || 0;

    // Calculate the total number of orders
    const totalOrders = fulfilled + unfulfilled;

    // Calculate the fulfillment rate
    const fulfillmentRate =
      totalOrders > 0 ? (fulfilled / totalOrders) * 100 : 0;

    // Generate a summary message
    let summaryMessage = "";
    if (fulfillmentRate > 50) {
      summaryMessage = `📈 The fulfillment rate is high (${fulfillmentRate.toFixed(
        2
      )}%). Great job!`;
    } else if (fulfillmentRate > 0) {
      summaryMessage = `📉 The fulfillment rate is moderate (${fulfillmentRate.toFixed(
        2
      )}%). Keep improving!`;
    } else {
      summaryMessage = "⭕ No orders have been fulfilled yet.";
    }

    return summaryMessage;
  };

  // Get the fulfillment summary
  const summaryMessage = getFulfillmentSummary(barData);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#c10300" />
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <strong>Summary:</strong> {summaryMessage}
      </div>
    </div>
  );
};

// ✅ Production Histogram
const fetchHistogramData = (
  apiUri: string,
  setState: React.Dispatch<React.SetStateAction<any[]>>
) => {
  useEffect(() => {
    fetch(apiUri)
      .then((res) => res.json())
      .then((data) => setState(data))
      .catch((err) => console.error("Error fetching histogram data:", err));
  }, [apiUri]);
};

// ✅ Production Histogram component
const Histogram: React.FC<{ apiUri: string }> = ({ apiUri }) => {
  const [histogramData, setHistogramData] = useState<
    { range: string; count: number }[]
  >([]);

  fetchHistogramData(apiUri, setHistogramData);

  // Function to calculate histogram summary
  const getHistogramSummary = (data: { range: string; count: number }[]) => {
    if (data.length === 0) return "No data available.";

    // Find the most common range
    const mostCommon = data.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );

    // Find the least common range
    const leastCommon = data.reduce((prev, current) =>
      prev.count < current.count ? prev : current
    );

    // Calculate total items
    const totalItems = data.reduce((sum, item) => sum + item.count, 0);

    // Calculate average count
    const averageCount = totalItems / data.length;

    // Generate a summary message
    const summaryMessage = `
      The most common range is "${mostCommon.range}" with ${
      mostCommon.count
    } items.
      The least common range is "${leastCommon.range}" with ${
      leastCommon.count
    } items.
      On average, each range has ${averageCount.toFixed(2)} items.
      Total items across all ranges: ${totalItems}.
    `;

    return summaryMessage;
  };

  // Get the histogram summary
  const summaryMessage = getHistogramSummary(histogramData);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={histogramData}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#d8847c" />
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <strong>Summary:</strong> {summaryMessage}
      </div>
    </div>
  );
};

//

const Dashboard: React.FC = () => {
  const {
    productionData,
    loading: productionLoading,
    error: productionError,
  } = useProductionData();

  const {
    workOrders,
    loading: workOrdersLoading,
    error: workOrdersError,
  } = useWorkOrders();

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

  if (
    productionLoading ||
    workOrdersLoading ||
    logisticsLoading ||
    trackingLoading
  )
    return <div className="loading">Loading...</div>;
  if (productionError || workOrdersError || logisticsError || trackingError)
    return <div className="error">Error loading data.</div>;

  // Calculate dynamic values
  const totalActiveWorkOrders = workOrders.length;
  const completedWorkOrders = workOrders.filter(
    (order) => order.status === "Completed"
  ).length;
  const pendingModuleRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;
  const shipmentsInTransit = trackingLogs.filter(
    (log) => log.status === "In Transit"
  ).length;
  const shipmentsCompleted = trackingLogs.filter(
    (log) => log.status === "Completed"
  ).length;

  {
    /*db.production.updateMany(
   {}, 
   { $rename: { "quantityProduced": "producedQty" } }
)*/
  }

// Combine data from trackingLogs and requests
const combinedData = trackingLogs.map((log) => {
  const request = requests.find((req) => req._id === log.requestID);
  return {
    ...log,
    requestDate: request ? request.requestDate : null,
  };
});

// Calculate dynamic values for the modules section
const totalModuleRequests = requests.length;
const fulfilledModuleRequests = requests.filter(
  (request) => request.status && request.status.toLowerCase() === "fulfilled"
).length;
const pendingShipments = trackingLogs.filter(
  (log) => log.status.toLowerCase() === "pending"
).length;
// Calculate average delivery time
const averageDeliveryTime = combinedData.reduce((acc, log) => {
  if (log.deliveredDate && log.requestDate) {
    const deliveryTime = new Date(log.deliveredDate).getTime() - new Date(log.requestDate).getTime();
    return acc + deliveryTime;
  }
  return acc;
}, 0) / combinedData.length || 0;

// Convert average delivery time from milliseconds to days
const averageDeliveryTimeInDays = averageDeliveryTime / (1000 * 60 * 60 * 24);

  // Calculate production view values
  const productionRate =
    productionData.reduce((acc, item) => acc + item.producedQty, 0) /
      productionData.length || 0;
  const lateFulfillments = productionData.filter(
    (item) => !item.orderOnTime
  ).length;
  const totalUnitsProduced = productionData.reduce(
    (acc, item) => acc + item.producedQty,
    0
  );
  
  const fulfillmentEfficiency =
    (productionData.filter((item) => item.orderFulfilled).length /
      productionData.length) *
      100 || 0;

  const softCoolColors = [
    "#D64550", // Soft Crimson
    "#E57373", // Light Coral
    "#F28E8E", // Warm Pastel Red
    "#F8B6B6", // Pale Blush Red
    "#FDDCDC", // Very Soft Pink
  ];

  return (
    <div className="main-div">
      <Header />

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, newView) => setView(newView)}
        aria-label="Dashboard View"
        sx={{
          display: "flex",
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
              backgroundColor: "#ad0232",
              color: "white",
              boxShadow: "0px 2px 8px rgba(212, 126, 126, 0.4)",
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
              backgroundColor: "#ad0232",
              color: "white",
              boxShadow: "0px 2px 8px rgba(212, 126, 126, 0.4)",
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
              backgroundColor: "#ad0232",
              color: "white",
              boxShadow: "0px 2px 8px rgba(212, 126, 126, 0.4)",
            },
          }}
        >
          Modules
        </ToggleButton>
        <GenerateReport />
      </ToggleButtonGroup>

      {/* top cards*/}
      {/*jump2all*/}
      {view === "all" && (
        <div className="main-div">
          <div className="small-holder">
            {/* ✅ Daily Quota Progress Card */}
            <UnifiedCard
              type="summary"
              title="Total Active Work Orders"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={totalActiveWorkOrders} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Unresolved Requests Summary */}
            <UnifiedCard
              type="summary"
              title="Completed Work Orders"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={completedWorkOrders} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Weekly Trend Rate Card */}
            <UnifiedCard
              type="summary"
              title="Pending Module Requests"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={pendingModuleRequests} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Monthly Revenue Summary */}
            <UnifiedCard
              type="summary"
              title="Shipments Completed"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={shipmentsCompleted} // DYNAMICVALUE
              description="vs 30 days"
            />
          </div>

          <div className="dashboard-contents">
            {/* Left side components */}
            <div className="bigger-components">
              <div id="production-heatmap" className="component-holder">
                <h2>Production feed</h2>
                <div className="chart">
                  <Heatmap />
                </div>
              </div>

              <div className="component-holder">
                <h2>Recent requests</h2>
                <div className="chart">
                  <div className="pie-chart">
                    {requests.map((item, index) => {
                      const bgColor =
                        softCoolColors[index % softCoolColors.length];
                      const textColor = index < 3 ? "#000" : "#000"; // Darker colors get white text, lighter get dark text

                      return (
                        <div
                          key={item._id}
                          className="slice"
                          style={{
                            backgroundColor: bgColor,
                            color: textColor, // Dynamic font color
                            borderRadius: "12px",
                            padding: "8px 17px 10px",
                          }}
                        >
                          <span>{item.module}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* End of left side components */}

            {/* Right side components */}
            <div className="smaller-components">
              <div className="component-holder">
                <div className="calendar-dashboard">
                  <h2>Reminders</h2>
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
              <div className="component-holder">
                <h2>Shipping updates</h2>
                <ul className="tracking-logs">
                  {trackingLogs.map((log) => (
                    <li key={log.requestID}>
                      <span className="module">{log.moduleCode}</span>:{" "}
                      {log.status} (Updated by {log.dispatchedBy} on{" "}
                      {log.deliveredDate
                        ? new Date(log.deliveredDate).toLocaleDateString()
                        : "N/A"}
                      )
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "production" && (
        <div className="main-div">
          <div className="small-holder">
            {/* ✅ Daily Quota Progress Card */}
            <UnifiedCard
              type="rate"
              title="Production Rate"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={parseFloat(productionRate.toFixed(2))} // DYNAMICVALUE
              oldValue={58} // You can replace this with a dynamic value if needed
            />

            {/* ✅ Unresolved Requests Summary */}
            <UnifiedCard
              type="summary"
              title="Late Fulfillments "
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={parseFloat(lateFulfillments.toFixed(2))} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Weekly Trend Rate Card */}
            <UnifiedCard
              type="summary"
              title="Total Units Produced"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={parseFloat(totalUnitsProduced.toFixed(2))} // DYNAMICVALUE
              description="in 24 hours"
            />

            {/* ✅ Monthly Revenue Summary */}
            <UnifiedCard
              type="rate"
              title="Fulfillment Efficiency"
              icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
              currentValue={parseFloat(fulfillmentEfficiency.toFixed(2))} // DYNAMICVALUE
              oldValue={100} // You can replace this with a dynamic value if needed
            />
          </div>

          <div className="dashboard-contents">
            <div className="bigger-components">
              <div id="linechart-70" className="component-holder">
                <h2>Production Performance</h2>
                <LineChartComponent />
              </div>

              <div className="component-holder">
                <ProductionTable />
              </div>
            </div>

            <div className="smaller-components">
              <div className="component-holder">
                <h2>Order Fulfillment Status</h2>
                <BarChartComponent apiUri="http://localhost:5001/api/order-fulfillment" />
              </div>
              <div className="component-holder">
                <h2>Produced Quantity Distribution</h2>
                <Histogram apiUri="http://localhost:5001/api/produced-quantity-distribution" />
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
              {/* ✅ Total Module Requests */}
              <UnifiedCard
                type="summary"
                title="Total Module Requests"
                icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
                currentValue={totalModuleRequests} // DYNAMICVALUE
                description="in 24 hours"
              />

              {/* ✅ Fulfilled Module Requests */}
              <UnifiedCard
                type="summary"
                title="Fulfilled Module Requests"
                icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
                currentValue={fulfilledModuleRequests} // DYNAMICVALUE
                description="in 24 hours"
              />

              {/* ✅ Pending Shipments */}
              <UnifiedCard
                type="summary"
                title="Pending Shipments"
                icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
                currentValue={pendingShipments} // DYNAMICVALUE
                description="in 24 hours"
              />

              {/* ✅ Average Delivery Time */}
              <UnifiedCard
                type="summary"
                title="Average Delivery Time"
                icon={<AssignmentTurnedIn sx={{ color: "#0f38bf" }} />}
                currentValue={parseFloat(averageDeliveryTimeInDays.toFixed(2))} // DYNAMICVALUE
                description="in days"
              />
            </div>

            <div className="dashboard-contents">
              <div className="bigger-components">
                <div className="component-holder">
                  <h2>Most Requested Items</h2>
                  <CustomBarChart apiUri="http://localhost:5001/api/module-chart" />
                </div>

                <div className="component-holder">
                  <ModulesTable />
                </div>
              </div>
              <div className="smaller-components">
                <div className="component-holder">
                  <h2>Factory Request Distribution</h2>
                  <PieChartComponent apiUrl="http://localhost:5001/api/logistics-summary" />
                </div>
                <div className="component-holder">
                  <h2>Module Request Fulfillment Rate</h2>
                  <GaugeChart apiUri="http://localhost:5001/api/fulfillment-rate" />
                </div>
              </div>
            </div>
            <div className="component-holder">
              <h2>Recent requests</h2>
              <div className="chart">
                <div className="pie-chart">
                  {requests.map((item, index) => {
                    const bgColor = softCoolColors[index % softCoolColors.length];
                    const textColor = index < 3 ? "#000" : "#000"; // Darker colors get white text, lighter get dark text

                    return (
                      <div
                        key={item._id}
                        className="slice"
                        style={{
                          backgroundColor: bgColor,
                          color: textColor, // Dynamic font color
                          borderRadius: "12px",
                          padding: "8px 17px 10px",
                        }}
                      >
                        <span>{item.module}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;