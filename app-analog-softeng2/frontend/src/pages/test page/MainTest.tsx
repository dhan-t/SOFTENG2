import React from "react";
import "../1_dashboard/Dashboard.css";
import {
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface CardProps {
  type: "progress" | "rate" | "summary";
  title: string;
  currentValue?: number;
  maxValue?: number;
  oldValue?: number;
  description?: string;
}

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

  return (
    <div className={`small-dashboard-card ${type}-card`}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Left Side */}
        <Box sx={{ flex: 7 }}>
          <Typography variant="h6" className="card-title">
            {title}
          </Typography>
          <Typography variant="h4" color="primary" className="card-value">
            {currentValue}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className="card-units"
          >
            {type === "rate" ? "vs. previous value" : description}
          </Typography>
        </Box>

        {/* ✅ Right Side: Show only if "rate" type */}
        {type === "rate" && (
          <Box
            sx={{
              flex: 3,
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* ✅ Dynamic Icon Box */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 50,
                height: 50,
                borderRadius: "50%",
              }}
            >
              <IconComponent sx={{ fontSize: "4rem", color: iconColor }} />
            </Box>

            {/* ✅ Dynamic Percentage Change */}
            <Chip
              label={`${percentageChange}%`}
              color={isPositive ? "success" : "error"}
              sx={{ mt: 1, fontSize: "1.2rem" }}
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
          />
        </Box>
      )}
    </div>
  );
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
      />
      <UnifiedCard
        type="rate"
        title="Weekly Sales Drop"
        currentValue={90}
        oldValue={120}
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
