import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface EquipmentRequestsProps {
  totalRequests: number;
  pendingRequests: number;
}

const EquipmentRequests: React.FC<EquipmentRequestsProps> = ({
  totalRequests,
  pendingRequests,
}) => {
  return (
    <Card sx={{ margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Equipment Requests
        </Typography>
        <Typography variant="h4" color="primary">
          {totalRequests} Total
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {pendingRequests} Pending
        </Typography>
        <AssignmentIcon color="action" />
      </CardContent>
    </Card>
  );
};

export default EquipmentRequests;
