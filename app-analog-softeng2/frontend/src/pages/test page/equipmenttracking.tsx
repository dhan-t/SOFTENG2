import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface EquipmentTrackingProps {
  tracked: number;
  inTransit: number;
}

const EquipmentTracking: React.FC<EquipmentTrackingProps> = ({
  tracked,
  inTransit,
}) => {
  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Equipment Tracking
        </Typography>
        <Typography variant="h4" color="primary">
          {tracked} Tracked
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {inTransit} In Transit
        </Typography>
        <LocalShippingIcon color="action" />
      </CardContent>
    </Card>
  );
};

export default EquipmentTracking;
