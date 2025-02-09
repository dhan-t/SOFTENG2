import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";

interface FactoryEfficiencyProps {
  efficiency: number;
}

const FactoryEfficiency: React.FC<FactoryEfficiencyProps> = ({
  efficiency,
}) => {
  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Factory Efficiency
        </Typography>
        <Typography variant="h4" color={efficiency >= 75 ? "green" : "red"}>
          {efficiency}%
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <SpeedIcon color="action" />
          <Typography variant="body2" color="textSecondary" ml={1}>
            Overall Efficiency
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FactoryEfficiency;
