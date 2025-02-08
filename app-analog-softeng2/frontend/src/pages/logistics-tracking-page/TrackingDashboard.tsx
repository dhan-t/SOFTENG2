import React, { useEffect } from "react";
import { useTracking } from "../../hooks/useTracking";
import "./TrackingDashboard.css";
import Header from "../components/Header";

const TrackingDashboard = () => {
  const {
    trackingLogs,
    fetchTrackingLogs,
    updateTrackingStatus,
    loading,
    error,
  } = useTracking();

  useEffect(() => {
    fetchTrackingLogs();
  }, []);

  const handleStatusUpdate = async (logId: string, newStatus: string) => {
    await updateTrackingStatus(logId, newStatus);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-div">
      <Header />
      <table className="styled-table">
        <thead>
          <tr className="row">
            <th>Module</th>
            <th>Status</th>
            <th>Updated By</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trackingLogs.map((log) => (
            <tr key={log.logId}>
              <td>{log.module}</td>
              <td>{log.status}</td>
              <td>{log.updatedBy}</td>
              <td>{new Date(log.updatedAt).toLocaleString()}</td>
              <td>
                <select
                  value={log.status}
                  onChange={(e) =>
                    handleStatusUpdate(log.logId, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingDashboard;
