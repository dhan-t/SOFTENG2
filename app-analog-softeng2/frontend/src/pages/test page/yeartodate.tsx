import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

interface YearToDateProps {
  produced: number;
  annualTarget: number;
}

const YearToDate: React.FC<YearToDateProps> = ({ produced, annualTarget }) => {
  const progress = (produced / annualTarget) * 100;

  return (
    <Card sx={{ margin: 2, padding: 2 }}>
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

export default YearToDate;
