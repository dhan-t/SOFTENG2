import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

interface WeeklyProductionProps {
  produced: number;
  previous: number;
}

const WeeklyProduction: React.FC<WeeklyProductionProps> = ({
  produced,
  previous,
}) => {
  const difference = produced - previous;
  const isPositive = difference >= 0;
  const percentageChange = ((difference / previous) * 100).toFixed(1);

  return (
    <Card sx={{ margin: 2, padding: 2 }}>
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

export default WeeklyProduction;
