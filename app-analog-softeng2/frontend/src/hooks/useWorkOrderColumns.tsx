// src/hooks/useWorkOrderColumns.ts
import { useState, useEffect } from "react";
import { useWorkOrders } from "./useWorkOrder";

export const useWorkOrderColumns = () => {
  const { workOrders, fetchWorkOrders } = useWorkOrders();
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  useEffect(() => {
    if (workOrders.length > 0) {
      const extractedColumns = workOrders.map((order) => ({
        _id: order._id,
        module: order.module,
        assignedTo: order.assignedTo,
        phoneModel: order.phoneModel,
        dateRequested: order.dateRequested,
      }));
      setColumns(extractedColumns);
    }
  }, [workOrders]);

  return { workOrderColumns: columns };
};
