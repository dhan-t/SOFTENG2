import React from "react";
import { useLogistics } from "../../hooks/useLogistics";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ModulesTable: React.FC = () => {
  const { requests } = useLogistics();

  const rows = requests.map((request, index) => ({
    index: index + 1, // Add index starting from 1
    id: request._id, // Use _id as the unique ID
    module: request.module,
    requestedBy: request.requestedBy,
    recipient: request.recipient, // Add recipient field
    requestDate: request.requestDate,
    status: request.status,
  }));

  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 20, maxWidth: 20 },
    { field: "id", headerName: "Request ID", flex: 1 },
    { field: "module", headerName: "Module Code", flex: 1, sortable: true },
    {
      field: "requestedBy",
      headerName: "Requested By",
      flex: 1,
      sortable: true,
    },
    { field: "recipient", headerName: "Recipient", flex: 1, sortable: true },
    {
      field: "requestDate",
      headerName: "Request Date",
      flex: 1,
      sortable: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      sortable: true,
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div>
      <h2>Existing Requests</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
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
  );
};

export default ModulesTable;
