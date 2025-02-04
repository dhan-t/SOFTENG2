// hooks/useLogistics.tsx
import { useState, useEffect } from "react";

interface LogisticsRequest {
  _id?: string;
  module: string;
  requestedBy: string;
  description: string;
  recipient: string;
  requestDate: string;
  quantity: number;
  status?: string;
}

export const useLogistics = () => {
  const [requests, setRequests] = useState<LogisticsRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all logistics requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/logistics");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching logistics requests:", err);
      setError("Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  // Submit a new logistics request
  const submitRequest = async (newRequest: LogisticsRequest) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      });

      if (res.ok) {
        await fetchRequests(); // Refresh list after successful submission
        return true;
      } else {
        setError("Failed to submit request.");
        return false;
      }
    } catch (err) {
      console.error("Error submitting logistics request:", err);
      setError("An error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests, submitRequest, loading, error };
};
