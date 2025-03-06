import React, { useEffect } from "react";
import { useProductionData } from "../../hooks/useProductionData";
import { useDataWorkOrder } from "../../hooks/useDataWorkOrder";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

const ProductionTable: React.FC = () => {
  const { productionData, fetchProductionData, loading, error } =
    useProductionData();

  const { workOrders } = useDataWorkOrder();

  useEffect(() => {
    fetchProductionData();
  }, []);

  // Merge productionData with workOrders to include phoneModel
  const mergedData = productionData.map((item) => {
    const workOrder = workOrders.find((order) => order.id === item.workOrderID);
    return {
      ...item,
      phoneModel: workOrder?.module || "",
    };
  });

  const rows = mergedData.map((item, index) => ({
    ...item,
    id: item.id || index,
    index: index + 1,
  }));

  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 20, maxWidth: 20 },
    {
      field: "workOrderID",
      headerName: "Work Order ID",
      sortable: true,
      flex: 1,
    },
    {
      field: "phoneModel",
      headerName: "Phone Model",
      flex: 1,
      sortable: true,
    },
    {
      field: "dateRequested",
      headerName: "Date Requested",
      flex: 1,
      sortable: true,
    },
    {
      field: "producedQty",
      headerName: "Produced Qty",
      flex: 1,
      sortable: true,
    },
    {
      field: "dateFulfilled",
      headerName: "Date Fulfilled",
      flex: 1,
      sortable: true,
    },
    {
      field: "orderFulfilled",
      headerName: "Order Fulfilled?",
      flex: 1,
      sortable: true,
      renderCell: (params) => (params.row.orderFulfilled ? "✅" : "❌"),
    },
    {
      field: "orderOnTime",
      headerName: "Order On Time?",
      flex: 1,
      sortable: true,
      renderCell: (params) => (params.row.orderOnTime ? "✅" : "❌"),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Production Reports</h2>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 50, 100]}
        sx={{
          backgroundColor: "white",
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
          },
        }}
      />
    </div>
  );
};

export default ProductionTable;
