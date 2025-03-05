import { useState, useEffect } from "react";

interface TrackingLog {
  _id: string;
  id?: string;
  logId?: string;
  requestID?: string;
  moduleCode?: string;
  module?: string;
  quantity?: number;
  phoneModel?: string;
  deliveredDate?: string;
  dispatchedBy?: string;
  remarks?: string;
  status: string;
  recipient?: string;
  moduleOrigin?: string;
  requestedBy?: string;
  updatedBy?: string;
  updatedAt?: string;
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
      const rawData = await res.json();

      // Normalize data format
      const normalizedData = rawData.map((log: any) => ({
        _id: log._id,
        id: log.id || log.logId, // Use id if available, else logId
        requestID: log.requestID || "",
        moduleCode: log.moduleCode || log.module || "",
        quantity: log.quantity || 0,
        phoneModel: log.phoneModel || "",
        deliveredDate: log.deliveredDate || "",
        dispatchedBy: log.dispatchedBy || "",
        remarks: log.remarks || "",
        status: log.status || "Unknown",
        recipient: log.recipient || "",
        moduleOrigin: log.moduleOrigin || "",
        requestedBy: log.requestedBy || "",
        updatedBy: log.updatedBy || "",
        updatedAt: log.updatedAt || "",
      }));

      setTrackingLogs(normalizedData);
    } catch (err) {
      setError((err as Error).message);
      console.error("Fetch tracking logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTrackingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update tracking status");
      await fetchTrackingLogs(); // Refresh the tracking logs after updating
    } catch (err) {
      setError((err as Error).message);
      console.error("Update tracking status error:", err);
    }
  };

  useEffect(() => {
    fetchTrackingLogs();
  }, []);

  return {
    trackingLogs,
    fetchTrackingLogs,
    updateTrackingStatus,
    loading,
    error,
  };
};
