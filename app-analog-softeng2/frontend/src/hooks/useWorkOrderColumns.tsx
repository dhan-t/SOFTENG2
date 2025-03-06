import { useState, useEffect } from "react";
import { useWorkOrders } from "./useWorkOrder";

export const useWorkOrderColumns = () => {
  const { workOrders } = useWorkOrders();
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    if (workOrders.length > 0) {
      const extractedColumns = workOrders.map((order) => ({
        _id: order._id,
        module: order.module,
        assignedTo: order.assignedTo,
        phoneModel: order.phoneModel,
        createdDate: order.createdDate, // Include createdDate
        dueDate: order.dueDate, // Include dueDate
        quantity: order.quantity, // Include quantity
      }));
      setColumns(extractedColumns);
    }
  }, [workOrders]);

  return { workOrderColumns: columns };
};
