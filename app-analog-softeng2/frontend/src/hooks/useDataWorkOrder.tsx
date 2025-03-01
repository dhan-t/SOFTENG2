import { useState, useEffect } from "react";

const useDataWorkOrder = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/workorders"); // Adjust URL if needed
        if (!response.ok) throw new Error("Failed to fetch work orders");

        const data = await response.json();
        setWorkOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  return { workOrders, loading, error };
};

export default useDataWorkOrder;
