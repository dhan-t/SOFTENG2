import React, { useState, useEffect } from "react";
import { useProductionData } from "../../hooks/useProductionData";
import { useDataWorkOrder } from "../../hooks/useDataWorkOrder";
import "./ReportProduction.css";
import "../components/global.css";
import Header from "../components/Header";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";

import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import {
  Event as EventIcon,
  Person as PersonIcon,
  SmartphoneRounded as SmartphoneRoundedIcon,
} from "@mui/icons-material";

interface ProductionData {
  id?: string;
  workOrderID: string;
  dateRequested: string;
  fulfilledBy: string;
  dateFulfilled: string;
  producedQty: number;
  requestedQuantity: number; // Add requestedQuantity
  orderFulfilled: boolean;
  orderOnTime: boolean;
  phoneModel?: string;
}

const ReportProduction: React.FC = () => {
  const {
    productionData,
    fetchProductionData,
    addProductionData,
    updateProductionData,
    deleteProductionData,
    loading,
    error,
  } = useProductionData();

  const { workOrders } = useDataWorkOrder();

  const [formData, setFormData] = useState<ProductionData>({
    workOrderID: "",
    phoneModel: "",
    dateRequested: "",
    fulfilledBy: "",
    dateFulfilled: "",
    producedQty: 0,
    requestedQuantity: 0, // Add requestedQuantity
    orderFulfilled: false,
    orderOnTime: false,
  });
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    fetchProductionData();
  }, []);

  // Handle work order selection change
  const handleWorkOrderChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value as string;
    const selectedOrder = workOrders.find(
      (order) => order.id === selectedValue
    );

    if (selectedOrder) {
      setFormData({
        ...formData,
        workOrderID: selectedOrder.id,
        dateRequested: selectedOrder.createdDate, // Autofill dateRequested
        phoneModel: selectedOrder.phoneModel, // Autofill phoneModel
        requestedQuantity: selectedOrder.quantity, // Autofill requestedQuantity
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedData = {
      workOrderID: formData.workOrderID,
      dateRequested: formData.dateRequested,
      fulfilledBy: formData.fulfilledBy,
      dateFulfilled: formData.dateFulfilled,
      producedQty: formData.producedQty,
      requestedQuantity: formData.requestedQuantity, // Include requestedQuantity
      orderFulfilled: formData.producedQty >= formData.requestedQuantity, // Compare producedQty with requestedQuantity
      orderOnTime:
        new Date(formData.dateFulfilled) <= new Date(formData.dateRequested), // Example logic for on-time fulfillment
    };

    if (editMode) {
      await updateProductionData({ ...formattedData, id: editMode });
    } else {
      await addProductionData(formattedData);
    }
    setFormData({
      workOrderID: "",
      phoneModel: "",
      dateRequested: "",
      fulfilledBy: "",
      dateFulfilled: "",
      producedQty: 0,
      requestedQuantity: 0, // Reset requestedQuantity
      orderFulfilled: false,
      orderOnTime: false,
    });
    setEditMode(null);
  };

  const handleEdit = (item: ProductionData) => {
    setFormData({
      ...item,
      dateFulfilled: item.dateFulfilled.split("T")[0], // Convert date to YYYY-MM-DD format
    });
    setEditMode(item.id || null);
  };

  const handleDelete = async (id: string) => {
    await deleteProductionData(id);
    fetchProductionData(); // Refresh the data after deletion
  };

  // Merge productionData with workOrders to include phoneModel
  const mergedData = productionData.map((item) => {
    const workOrder = workOrders.find((order) => order.id === item.workOrderID);
    return {
      ...item,
      phoneModel: workOrder?.phoneModel || item.phoneModel || "Unknown Model",
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
      width: 100,
      sortable: true,
    },
    {
      field: "phoneModel",
      headerName: "Phone Model",
      width: 150,
      sortable: true,
    },
    {
      field: "dateRequested",
      headerName: "Date Requested",
      width: 200,
      sortable: true,
    },
    {
      field: "producedQty",
      headerName: "Produced Qty",
      width: 150,
      sortable: true,
    },
    {
      field: "dateFulfilled",
      headerName: "Date Fulfilled",
      width: 200,
      sortable: true,
    },
    {
      field: "orderFulfilled",
      headerName: "Order Fulfilled?",
      width: 100,
      sortable: true,
      renderCell: (params) => (params.row.orderFulfilled ? "✅" : "❌"), // Fixed logic
    },
    {
      field: "orderOnTime",
      headerName: "Order On Time?",
      width: 100,
      sortable: true,
      renderCell: (params) => (params.row.orderOnTime ? "✅" : "❌"), // Fixed logic
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-div">
      <Header />

      <div className="form-and-card">
        <div className="form-holder">
          <form onSubmit={handleSubmit} className="form">
            <h2 className="h2">
              {editMode ? "Edit report" : "Report production"}
            </h2>

            {/* Responsive Form Grid */}
            <div className="form-grid">
              {/* Work Order Dropdown */}
              <FormControl
                fullWidth
                required
                className="form-group"
                sx={{
                  marginBottom: "8px", // Reduce bottom margin to save space
                  "& .MuiInputBase-root": {
                    minHeight: "40px", // Reduce input field height
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "12px", // Slightly smaller label
                  },
                }}
              >
                <InputLabel>Select Work Order</InputLabel>
                <Select
                  value={formData.workOrderID}
                  onChange={handleWorkOrderChange}
                  label="Work Order ID"
                >
                  <MenuItem value="">
                    <em>Select Work Order</em>
                  </MenuItem>
                  {workOrders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {order.id} - {order.phoneModel}{" "}
                      {/* Display work order ID and phone model */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Date Requested Field (Autofilled) */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="form-group"
                  label="Date Requested"
                  value={
                    formData.dateRequested
                      ? dayjs(formData.dateRequested)
                      : null
                  }
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      dateRequested: newValue
                        ? newValue.format("YYYY-MM-DD")
                        : "",
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled // Disable editing since it's autofilled
                />
              </LocalizationProvider>

              {/* Requested Quantity Field (Autofilled) */}
              <TextField
                className="form-group"
                label="Requested Quantity"
                variant="outlined"
                type="number"
                value={formData.requestedQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requestedQuantity: parseInt(e.target.value),
                  })
                }
                required
                fullWidth
                disabled // Disable editing since it's autofilled
              />

              {/* Fulfilled By Field */}
              <TextField
                className="form-group"
                label="Fulfilled By"
                variant="outlined"
                type="text"
                value={formData.fulfilledBy}
                onChange={(e) =>
                  setFormData({ ...formData, fulfilledBy: e.target.value })
                }
                required
                fullWidth
              />

              {/* Date Fulfilled Field */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="form-group"
                  label="Date Fulfilled"
                  value={
                    formData.dateFulfilled
                      ? dayjs(formData.dateFulfilled)
                      : null
                  }
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      dateFulfilled: newValue
                        ? newValue.format("YYYY-MM-DD")
                        : "",
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              {/* Produced Quantity Field */}
              <TextField
                className="form-group"
                label="Produced Quantity"
                variant="outlined"
                type="number"
                value={formData.producedQty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    producedQty: parseInt(e.target.value),
                  })
                }
                required
                fullWidth
              />

              {/* Submit Button */}
              <div className="form-actions">
                <Button
                  type="submit"
                  variant="contained"
                  color={editMode ? "primary" : "success"}
                  startIcon={editMode ? <EditIcon /> : <SaveIcon />}
                >
                  {editMode ? "Update" : "Add"}
                </Button>
                {editMode && (
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditMode(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div id="report-preview" className="preview-card">
          <h2 className="preview-title" id="report-title">
            Report Preview
          </h2>

          <div className="preview-icon">
            <SmartphoneRoundedIcon sx={{ fontSize: 300, color: "#E65100" }} />
          </div>

          <div className="preview-details">
            <div className="module-info">
              <h2 id="report-module-code">
                {formData.phoneModel || "Phone Model"}{" "}
                {/* Display phone model */}
              </h2>
              <h3 id="report-module-desc">
                {formData.dateRequested || "Date Requested"}
              </h3>
            </div>

            {/* Container for Chips */}
            <div className="chip-container">
              <Chip
                label={
                  formData.producedQty
                    ? `${formData.producedQty} pcs`
                    : "Produced Qty"
                }
                sx={{
                  fontWeight: "medium",
                  backgroundColor: "#FFCCBC",
                  color: "#BF360C",
                  minWidth: "120px",
                }}
              />

              <Chip
                icon={
                  <SmartphoneRoundedIcon
                    sx={{ color: "#e65100", fontSize: 25, paddingLeft: 1 }}
                  />
                }
                label={formData.phoneModel || "Phone Model"}
                sx={{
                  fontWeight: "medium",
                  backgroundColor: "#FFF3E0",
                  color: "#E65100",
                  minWidth: "140px",
                }}
              />

              <Chip
                icon={
                  <EventIcon
                    sx={{ color: "#E65100", fontSize: 25, paddingLeft: 1 }}
                  />
                }
                label={formData.dateFulfilled || "Date Fulfilled"}
                sx={{
                  fontWeight: "medium",
                  backgroundColor: "#FFF3E0",
                  color: "#E65100",
                  minWidth: "130px",
                }}
              />

              <Chip
                icon={
                  <PersonIcon
                    sx={{ color: "#e65100", fontSize: 25, paddingLeft: 1 }}
                  />
                }
                label={formData.fulfilledBy || "Fulfilled By"}
                sx={{
                  fontWeight: "medium",
                  backgroundColor: "#FFF3E0",
                  color: "#E65100",
                  minWidth: "130px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="styled-table">
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
    </div>
  );
};
export default ReportProduction;
