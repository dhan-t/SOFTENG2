import React from "react";
import "../1_dashboard/Dashboard.css";
import { CardContent, Typography, LinearProgress, Box } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

interface CardProps {
  type: "progress" | "rate" | "summary";
  title: string;
  currentValue?: number;
  maxValue?: number;
  oldValue?: number;
  icon?: React.ReactNode;
  description?: string;
}

const UnifiedCard: React.FC<CardProps> = ({
  type,
  title,
  currentValue = 0,
  maxValue = 0,
  oldValue = 0,
  icon,
  description = "",
}) => {
  if (type === "progress") {
    const percentCompleted = (currentValue / maxValue) * 100;
    const unitsLeft = maxValue - currentValue;

    return (
      <div className="small-dashboard-card">
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: ".2rem",
          }}
        >
          <Typography variant="h6" className="card-title">
            {title}
          </Typography>
          <Typography
            variant="h2"
            color="primary"
            className="card-value"
            sx={{ fontSize: "2.2rem", fontWeight: "bold" }}
          >
            {percentCompleted.toFixed(1)}% Completed
          </Typography>
          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress variant="determinate" value={percentCompleted} />
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            className="card-units"
            sx={{ mt: 1 }}
          >
            {unitsLeft} units left to full
          </Typography>
        </CardContent>
      </div>
    );
  }

  if (type === "rate") {
    const difference = currentValue - oldValue;
    const isPositive = difference >= 0;
    const percentageChange = ((difference / oldValue) * 100).toFixed(1);

    return (
      <div className="small-dashboard-card">
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: ".2rem",
          }}
        >
          <Typography variant="h6" className="card-title">
            {title}
          </Typography>
          <Typography
            variant="h4"
            color="primary"
            className="card-value"
            sx={{ fontSize: "2.2rem", fontWeight: "bold" }}
          >
            {currentValue}
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            {icon}
            <Typography
              variant="body2"
              color={isPositive ? "green" : "red"}
              ml={1}
              className="card-difference"
            >
              {isPositive ? <ArrowUpward /> : <ArrowDownward />}
              {percentageChange}% {isPositive ? "increase" : "decrease"}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="textSecondary"
            className="card-units"
            sx={{ mt: 1 }}
          >
            vs. previous value
          </Typography>
        </CardContent>
      </div>
    );
  }

  if (type === "summary") {
    return (
      <div className="small-dashboard-card">
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: ".2rem",
          }}
        >
          <Typography variant="h6" className="card-title">
            {title}
          </Typography>
          <Typography
            variant="h4"
            color="primary"
            className="card-value"
            sx={{ fontSize: "2.2rem", fontWeight: "bold" }}
          >
            {currentValue}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="card-units"
            sx={{ mt: 1 }}
          >
            {description}
          </Typography>
        </CardContent>
      </div>
    );
  }

  return null;
};
const MainTest: React.FC = () => {
  return (
    <div className="main-div">
      <UnifiedCard
        type="progress"
        title="Daily Quota"
        currentValue={94}
        maxValue={100}
      />
      <UnifiedCard
        type="rate"
        title="Weekly Sales"
        currentValue={1200}
        oldValue={100}
        icon={undefined}
      />
      <UnifiedCard
        type="summary"
        title="Monthly Revenue"
        currentValue={5000}
        description="Total revenue for the month"
      />
    </div>
  );
};
export default MainTest;
