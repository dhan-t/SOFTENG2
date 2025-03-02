import React, { useEffect } from "react";
import { useTracking } from "../../hooks/useTracking";
import "./TrackRequest.css";
import "../components/global.css";
import Header from "../components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const TrackRequest = () => {
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

  const rows = trackingLogs.map((log, index) => ({
    index: index + 1, // Add index starting from 1
    id: log._id, // Use _id as the unique ID
    module: log.module,
    requestedBy: log.requestedBy,
    recipient: log.recipient,
    status: log.status,
  }));

  {
    /*ALLCHANGE recipient should be Factory Name. Requested by should be employee name.
    - Status actions not working*/
  }
  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 20, maxWidth: 20 },
    { field: "id", headerName: "Request ID", width: 150, flex: 1 },
    { field: "module", headerName: "Module Code", width: 250, sortable: true },
    {
      field: "requestedBy",
      headerName: "Requested By",
      width: 200,
      sortable: true,
    },
    { field: "recipient", headerName: "Recipient", width: 200, sortable: true },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      sortable: true,
    },
  ];

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const paginationModel = { page: 0, pageSize: 5 };

  {
    /*ALLCHANGE connect to database. list all phone models to be created.*/
  }
  return (
    <div className="main-div">
      <Header />
      <div style={{ height: 400, width: "100%" }}>
        <h2>Existing Requests</h2>
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 50, 100]}
          sx={{
            backgroundColor: "white", // Set background to white
            border: "none", // Remove border if needed

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5", // Optional: header background color
            },
          }}
        />
      </div>
    </div>
  );
};

export default TrackRequest;
