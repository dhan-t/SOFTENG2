import React, { useState } from "react";
import { useProductionData } from "../../hooks/useProductionData"; // Adjust the import path as necessary
// import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const LineChartComponent: React.FC = () => {
  const { productionData } = useProductionData();
  const [requirement, setRequirement] = useState<number>(0);

  const handleRequirementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequirement(parseFloat(e.target.value));
  };

  // Compute data for the graph
  const data = productionData.map((item, index) => ({
    name: `Day ${index + 1}`,
    produced: item.producedQty,
  }));

  return (
    <div>
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

export default LineChartComponent;
