import React, { useState, useEffect } from "react";
import { useProductionData } from "../../hooks/useProductionData";
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

import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import useDataWorkOrder from "../../hooks/useDataWorkOrder";

import {
  Event as EventIcon,
  Person as PersonIcon,
  WidgetsRounded as WidgetsRoundedIcon,
  SmartphoneRounded as SmartphoneRoundedIcon,
} from "@mui/icons-material";

// Define your icons as SVGs or use an icon library
const CameraIcon = () => (
  <span role="img" aria-label="camera">
    📷
  </span>
);
const RectangleIcon = () => (
  <span role="img" aria-label="rectangle">
    📱
  </span>
);
const SpeakerIcon = () => (
  <span role="img" aria-label="speaker">
    🔊
  </span>
);

const WorkOrderSelector = () => {
  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const workOrderId = event.target.value;
    const selectedOrder = workOrders.find((order) => order.id === workOrderId);

    if (selectedOrder) {
      setSelectedWorkOrder(selectedOrder);
      setFormData({
        module: selectedOrder.module,
        requestDate: selectedOrder.requestDate,
        dueDate: selectedOrder.dueDate,
        quantity: selectedOrder.quantity,
      });
    }
  };
};

interface ProductionData {
  productId: string;
  productName: string;
  quantityProduced: number;
  dateProduced: string;
  moduleCode: string;
  description: string;
  reportedBy: string;
}

interface ModuleOption {
  code: string;
  description: string;
  icon: JSX.Element;
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

  const [formData, setFormData] = useState<ProductionData>({
    productId: "",
    productName: "",
    quantityProduced: 0,
    dateProduced: "",
    moduleCode: "",
    description: "",
    reportedBy: "",
  });
  const [editMode, setEditMode] = useState<string | null>(null);

  const moduleOptions: ModuleOption[] = [
    { code: "CMR123", description: "Camera module", icon: <CameraIcon /> },
    { code: "HSN123", description: "Housing module", icon: <RectangleIcon /> },
    { code: "SPK123", description: "Speaker module", icon: <SpeakerIcon /> },
  ];

  const handleModuleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    const selectedOption = moduleOptions.find(
      (option) => option.code === selectedValue
    );

    setFormData({
      ...formData,
      moduleCode: selectedOption?.code || "",
      description: selectedOption?.description || "",
    });
  };

  useEffect(() => {
    fetchProductionData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editMode) {
      await updateProductionData(formData);
    } else {
      await addProductionData(formData);
    }
    setFormData({
      productId: "",
      productName: "",
      quantityProduced: 0,
      dateProduced: "",
      moduleCode: "",
      description: "",
      reportedBy: "",
    });
    setEditMode(null);
  };

  const handleEdit = (item: ProductionData) => {
    setFormData({
      ...item,
      dateProduced: item.dateProduced.split("T")[0], // Convert date to YYYY-MM-DD format
    });
    setEditMode(item.productId);
  };

  const rows = productionData.map((item, index) => ({
    ...item,
    id: item.productId || index,
    index: index + 1,
  }));

  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 20, maxWidth: 20 },
    { field: "id", headerName: "Request ID", flex: 1, sortable: true },
    {
      field: "dateRequested",
      headerName: "Date Requested",
      flex: 1,
      sortable: true,
    },
    {
      field: "quantityRequested",
      headerName: "Requested Qty",
      flex: 1,
      sortable: true,
    },
    {
      field: "dateProduced",
      headerName: "Date Fulfilled",
      flex: 1,
      sortable: true,
    },
    {
      field: "quantityProduced",
      headerName: "Produced Qty",
      flex: 1,
      sortable: true,
    },
    {
      field: "orderFulfilled",
      headerName: "Order Fulfilled?",
      flex: 1,
      sortable: true,
      renderCell: (params) =>
        params.row.quantityProduced >= params.row.quantityRequested
          ? "✅"
          : "❌",
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
      <h2>{editMode ? "Edit report" : "Report production"}</h2>

      <div className="form-grid">
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
          <InputLabel>Select Work Order</InputLabel>
          <Select
            value={formData.moduleCode}
            onChange={handleModuleChange}
            label="Module Code"
            required
            sx={{ fontFamily: "Poppins" }}
          >
            <MenuItem value="">
              <em>Select Workorder</em>
            </MenuItem>
            {moduleOptions.map((option) => (
              <MenuItem key={option.code} value={option.code}>
                {option.code} - {option.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TextField
        label="Phone model AUTOFILL"
        variant="outlined"
        type="text"
        value={formData.productId}
        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
        required
        fullWidth
        sx={{ marginBottom: 2, fontFamily: "Poppins" }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date requested"
          value={formData.requestDate ? dayjs(formData.requestDate) : null}
          onChange={(newValue) =>
            setFormData({
              ...formData,
              requestDate: newValue ? newValue.format("YYYY-MM-DD") : "",
            })
          }
          slotProps={{ textField: { fullWidth: true, sx: { fontFamily: "Poppins" } } }}
        />
      </LocalizationProvider>

      <TextField
        label="Reporter"
        variant="outlined"
        type="text"
        value={formData.reportedBy}
        onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
        required
        fullWidth
        sx={{ marginBottom: 2, fontFamily: "Poppins" }}
      />

      <TextField
        label="Quantity Produced"
        variant="outlined"
        type="number"
        value={formData.quantityProduced}
        onChange={(e) =>
          setFormData({ ...formData, quantityProduced: parseInt(e.target.value) })
        }
        required
        fullWidth
        sx={{ marginBottom: 2, fontFamily: "Poppins" }}
      />

      <Button
        type="submit"
        variant="contained"
        disableElevation
        color={editMode ? "primary" : "success"}
        startIcon={editMode ? <EditIcon /> : <SaveIcon />}
        sx={{
          fontFamily: "Poppins",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "8px",
          textTransform: "none",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s linear",
          "&:hover": {
            backgroundColor: "#1b5e20",
            transform: "translateY(-2px)",
          },
        }}
      >
        {editMode ? "Update" : "Add"}
      </Button>

      {editMode && (
        <Button
          type="button"
          variant="contained"
          color="error"
          disableElevation
          startIcon={<CancelIcon />}
          onClick={() => setEditMode(null)}
          sx={{
            fontFamily: "Poppins",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            textTransform: "none",
            marginLeft: 2,
          }}
        >
          Cancel
        </Button>
      )}
    </form>
  </div>

{/* Report Preview Section */}
<div id="report-preview" className="preview-card">
  <h2 className="preview-title" id="report-title">
    Report Preview
  </h2>

  <div className="preview-icon">
    <SmartphoneRoundedIcon sx={{ fontSize: 270, color: "#E65100" }} />
  </div>

  <div className="preview-details">
    <h2 id="report-module-code">{formData.moduleCode || "Module Code"}</h2>
    <h3 id="report-module-desc">{formData.description || "Module Description"}</h3>
  </div>

  <div className="chip-container">
    <Chip label={formData.quantityProduced ? `${formData.quantityProduced} pc` : "Qty"} />
    <Chip
      icon={<SmartphoneRoundedIcon sx={{ color: "#E65100", fontSize: 25 }} />}
      label={formData.productId || "Phone Model"}
      sx={{ backgroundColor: "#FFF3E0", color: "#BF360C" }}
    />
    <Chip
      icon={<EventIcon sx={{ color: "#E65100", fontSize: 25 }} />}
      label={formData.dateProduced || "Fulfilled"}
      sx={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
    />
    <Chip
      icon={<PersonIcon sx={{ color: "#E65100", fontSize: 25 }} />}
      label={formData.reportedBy || "Reporter"}
      sx={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
    />
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

export default ReportProduction;
