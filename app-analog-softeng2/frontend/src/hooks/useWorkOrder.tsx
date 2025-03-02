import { useState, useEffect } from "react";

interface WorkOrder {
  _id?: string;
  module: string;
  createdBy: string;
  description: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status?: string;
}

export const useWorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all work orders
  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/workorder");
      if (!res.ok) throw new Error("Failed to fetch work orders");
      const data = await res.json();
      setWorkOrders(data);
    } catch (err) {
      console.error("Error fetching work orders:", err);
      setError("Failed to fetch work orders.");
    } finally {
      setLoading(false);
    }
  };

  // Submit a new work order
  const submitWorkOrder = async (newWorkOrder: WorkOrder) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/workorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkOrder),
      });

      if (res.ok) {
        await fetchWorkOrders(); // Refresh list after submission
        return true;
      } else {
        const errorText = await res.text();
        console.error("Failed to submit work order:", errorText);
        setError("Failed to submit work order.");
        return false;
      }
    } catch (err) {
      console.error("Error submitting work order:", err);
      setError("An error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update a work order status
  const updateWorkOrderStatus = async (workOrderId: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5001/api/workorder/${workOrderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        await fetchWorkOrders(); // Refresh list after update
        return true;
      } else {
        console.error("Failed to update work order status");
        setError("Failed to update work order.");
        return false;
      }
    } catch (err) {
      console.error("Error updating work order:", err);
      setError("An error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  return { workOrders, submitWorkOrder, updateWorkOrderStatus, loading, error };
};
