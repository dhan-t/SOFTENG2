import { useState, useEffect } from "react";

const useDataWorkOrder = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/workorder"); // Adjust URL if needed
        if (!response.ok) throw new Error("Failed to fetch work orders");

        const data = await response.json();

        // Extract only the necessary fields
        const formattedData = data.map((order: any) => ({
          id: order._id, // Work Order ID
          module: order.module, // Module
          requestDate: order.requestDate, // Date Requested
          dueDate: order.dueDate, // Due Date
          quantity: order.quantity, // Quantity
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
