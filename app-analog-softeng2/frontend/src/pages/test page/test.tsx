import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Tabs, Tab } from "@mui/material";

const data = {
  daily: [
    { name: "Day 1", produced: 65, requirement: 70 },
    { name: "Day 2", produced: 75, requirement: 70 },
    { name: "Day 3", produced: 80, requirement: 70 },
    { name: "Day 4", produced: 85, requirement: 70 },
    { name: "Day 5", produced: 90, requirement: 70 },
    { name: "Day 6", produced: 100, requirement: 70 },
    { name: "Day 7", produced: 110, requirement: 70 }, // Assume this is today
  ],
  weekly: [
    { name: "Week 1", produced: 450, requirement: 420 },
    { name: "Week 2", produced: 470, requirement: 420 },
    { name: "Week 3", produced: 500, requirement: 420 },
    { name: "Week 4", produced: 550, requirement: 420 },
  ],
  monthly: [
    { name: "Jan", produced: 1700, requirement: 1600 },
    { name: "Feb", produced: 1800, requirement: 1600 },
    { name: "Mar", produced: 1900, requirement: 1650 },
    { name: "Apr", produced: 1950, requirement: 1650 },
    { name: "May", produced: 2000, requirement: 1700 },
    { name: "Jun", produced: 2100, requirement: 1700 },
    { name: "Jul", produced: 2150, requirement: 1750 },
    { name: "Aug", produced: 2200, requirement: 1750 },
    { name: "Sep", produced: 2250, requirement: 1800 },
    { name: "Oct", produced: 2300, requirement: 1800 },
    { name: "Nov", produced: 2350, requirement: 1850 },
    { name: "Dec", produced: 2400, requirement: 1850 },
  ],
};

// ✅ Custom TabPanel Component (to handle visibility)
const CustomTabPanel: React.FC<{ index: number; value: number }> = ({
  index,
  value,
  children,
}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const LineChartComponent: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // Default to "Daily" tab

  // Assume "Day 7" is today
  const todayIndex = data.daily.length - 1;
  const todayData = data.daily[todayIndex];

  return (
    <div>
      {/* ✅ Tabs for Switching Views */}
      <Tabs
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
        variant="fullWidth"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Daily" />
        <Tab label="Weekly" />
        <Tab label="Monthly" />
      </Tabs>

      {/* ✅ Tab Content (Charts) */}
      <CustomTabPanel value={tabIndex} index={0}>
        <LineChart
          xAxis={[
            { scaleType: "point", data: data.daily.map((entry) => entry.name) },
          ]}
          series={[
            {
              data: data.daily.map((entry) => entry.produced),
              label: "Produced",
              color: "#4caf50",
              showMark: true,
              markOptions: {
                size: (index) => (index === todayIndex ? 10 : 5), // Highlight today's mark
                color: (index) =>
                  index === todayIndex ? "#f44336" : "#4caf50", // Different color for today
              },
            },
            {
              data: data.daily.map((entry) => entry.requirement),
              label: "Requirement",
              color: "#ff9800",
              showMark: true,
            },
          ]}
          height={400}
        />
        <Box mt={2}>
          <Typography variant="h6">Today's Summary</Typography>
          <Typography>
            Produced: {todayData.produced}, Requirement: {todayData.requirement}
          </Typography>
          <Typography>
            {todayData.produced >= todayData.requirement
              ? "Production meets or exceeds the requirement."
              : "Production is below the requirement."}
          </Typography>
        </Box>
      </CustomTabPanel>

      <CustomTabPanel value={tabIndex} index={1}>
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: data.weekly.map((entry) => entry.name),
            },
          ]}
          series={[
            {
              data: data.weekly.map((entry) => entry.produced),
              label: "Produced",
              color: "#4caf50",
              showMark: true,
            },
            {
              data: data.weekly.map((entry) => entry.requirement),
              label: "Requirement",
              color: "#ff9800",
              showMark: true,
            },
          ]}
          height={400}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabIndex} index={2}>
        <LineChart
          xAxis={[
            {
              scaleType: "point",
              data: data.monthly.map((entry) => entry.name),
            },
          ]}
          series={[
            {
              data: data.monthly.map((entry) => entry.produced),
              label: "Produced",
              color: "#4caf50",
              showMark: true,
            },
            {
              data: data.monthly.map((entry) => entry.requirement),
              label: "Requirement",
              color: "#ff9800",
              showMark: true,
            },
          ]}
          height={400}
        />
      </CustomTabPanel>
    </div>
  );
};

export default LineChartComponent;
