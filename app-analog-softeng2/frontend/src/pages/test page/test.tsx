import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Tabs, Tab } from "@mui/material";
const data = {
  daily: [
    { name: "Day 1", produced: 68, requirement: 70 },
    { name: "Day 2", produced: 72, requirement: 70 },
    { name: "Day 3", produced: 70, requirement: 70 },
    { name: "Day 4", produced: 69, requirement: 70 },
    { name: "Day 5", produced: 71, requirement: 70 },
    { name: "Day 6", produced: 70, requirement: 70 },
    { name: "Day 7", produced: 73, requirement: 70 }, // Assume this is today
  ],
  weekly: [
    { name: "Week 1", produced: 420, requirement: 420 },
    { name: "Week 2", produced: 415, requirement: 420 },
    { name: "Week 3", produced: 425, requirement: 420 },
    { name: "Week 4", produced: 410, requirement: 420 },
  ],
  monthly: [
    { name: "Jan", produced: 1600, requirement: 1600 },
    { name: "Feb", produced: 1550, requirement: 1600 },
    { name: "Mar", produced: 1650, requirement: 1650 },
    { name: "Apr", produced: 1620, requirement: 1650 },
    { name: "May", produced: 1700, requirement: 1700 },
    { name: "Jun", produced: 1680, requirement: 1700 },
    { name: "Jul", produced: 1600, requirement: 1650 },
    { name: "Aug", produced: 1580, requirement: 1650 },
    { name: "Sep", produced: 1700, requirement: 1700 },
    { name: "Oct", produced: 1650, requirement: 1700 },
    { name: "Nov", produced: 1600, requirement: 1650 },
    { name: "Dec", produced: 1550, requirement: 1650 },
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

  // Get last week's and last month's data
  const lastWeekData = data.weekly[data.weekly.length - 1];
  const lastMonthData = data.monthly[data.monthly.length - 1];

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

      {/* ✅ Daily Chart & Summary */}
      <CustomTabPanel value={tabIndex} index={0}>
        <LineChart
          xAxis={[
            { scaleType: "point", data: data.daily.map((entry) => entry.name) },
          ]}
          series={[
            {
              data: data.daily.map((entry) => entry.produced),
              label: "Produced",
              color: "#0952db",
              showMark: true,
            },
            {
              data: data.daily.map((entry) => entry.requirement),
              label: "Requirement",
              color: "#e00d54",
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
              ? "✅ Production meets or exceeds the requirement."
              : "⚠️ Production is below the requirement."}
          </Typography>
        </Box>
      </CustomTabPanel>

      {/* ✅ Weekly Chart & Summary */}
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
              color: "#0952db",
              showMark: true,
            },
            {
              data: data.weekly.map((entry) => entry.requirement),
              label: "Requirement",
              color: "#e00d54",
              showMark: true,
            },
          ]}
          height={400}
        />
        <Box mt={2}>
          <Typography variant="h6">Weekly Summary</Typography>
          <Typography>
            Produced: {lastWeekData.produced}, Requirement:{" "}
            {lastWeekData.requirement}
          </Typography>
          <Typography>
            {lastWeekData.produced >= lastWeekData.requirement
              ? "✅ Weekly production meets or exceeds the requirement."
              : "⚠️ Weekly production is below the requirement."}
          </Typography>
        </Box>
      </CustomTabPanel>

      {/* ✅ Monthly Chart & Summary */}
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
              color: "#0952db",
              showMark: true,
            },
            {
              data: data.monthly.map((entry) => entry.requirement),
              label: "Requirement",
              color: "#e00d54",
              showMark: true,
            },
          ]}
          height={400}
        />
        <Box mt={2}>
          <Typography variant="h6">Monthly Summary</Typography>
          <Typography>
            Produced: {lastMonthData.produced}, Requirement:{" "}
            {lastMonthData.requirement}
          </Typography>
          <Typography>
            {lastMonthData.produced >= lastMonthData.requirement
              ? "✅ Monthly production meets or exceeds the requirement."
              : "⚠️ Monthly production is below the requirement."}
          </Typography>
        </Box>
      </CustomTabPanel>
    </div>
  );
};

export default LineChartComponent;
