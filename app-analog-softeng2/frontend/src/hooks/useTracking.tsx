import { useState, useEffect } from "react";

interface TrackingLog {
  logId: string;
  module: string;
  status: string;
  updatedBy: string;
  updatedAt: string;
}

export const useTracking = () => {
  const [trackingLogs, setTrackingLogs] = useState<TrackingLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrackingLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/tracking");
      if (!res.ok) throw new Error("Failed to fetch tracking logs");
      const data = await res.json();
      setTrackingLogs(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateTrackingStatus = async (logId: string, status: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, status }),
      });
      if (!res.ok) throw new Error("Failed to update tracking status");
      await fetchTrackingLogs(); // Refresh the tracking logs after updating
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchTrackingLogs();
  }, []);

  return { trackingLogs, fetchTrackingLogs, updateTrackingStatus, loading, error };
};