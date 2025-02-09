import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

interface DailyQuotaProps {
  produced: number;
  target: number;
}

const DailyQuota: React.FC<DailyQuotaProps> = ({ produced, target }) => {
  const progress = (produced / target) * 100;

  return (
    <Card sx={{ margin: 2, padding: 2 }}>
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

export default DailyQuota;
