import { useState, useEffect } from "react";

interface WorkOrder {
  id: string;
  module: string;
  createdDate: string; // Add createdDate
  dueDate: string;
  quantity: number;
  phoneModel: string; // Add phoneModel
}

export const useDataWorkOrder = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/workorder");
        if (!response.ok) throw new Error("Failed to fetch work orders");

        const data = await response.json();

        // Map the backend response to the WorkOrder interface
        const formattedData = data.map((order: any) => ({
          id: order._id,
          module: order.module,
          createdDate: order.createdDate, // Add createdDate
          dueDate: order.dueDate,
          quantity: order.quantity,
          phoneModel: order.phoneModel || "Unknown Model", // Add phoneModel
        }));

        setWorkOrders(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  return { workOrders, loading, error };
};

export default useDataWorkOrder;
