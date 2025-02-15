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

import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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
    id: item.productId || index, // Ensure unique ID
    index: index + 1, // Add an index column
  }));

  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 20, maxWidth: 20 },
    {
      field: "productId",
      headerName: "Module Code", // should be work order id
      width: 150,
      sortable: true,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Module Description", // should be phone
      width: 200,
      sortable: true,
      flex: 1,
    },
    {
      field: "quantityProduced",
      headerName: "Qty",
      width: 40,
      maxWidth: 40,
      sortable: true,
    },
    {
      field: "dateProduced",
      headerName: "Date Requested", // should be from work order date request
      width: 200,
      sortable: true,
    },
    {
      field: "dateProduced",
      headerName: "Date Fulfilled", // should be from report production fulfillment date
      width: 200,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const { row } = params;
        return (
          <>
            <button className="edit-button" onClick={() => handleEdit(row)}>
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => {
                if (row.productId) {
                  deleteProductionData(row.productId);
                } else {
                  console.error("❌ No productId found for deletion!");
                }
              }}
            >
              Delete
            </button>
          </>
        );
      },
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

            {/*ALLCHANGE connect to database. should reference workorder IDs.*/}
            <div className="form-group">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Work Order</InputLabel>
                <Select
                  value={formData.moduleCode}
                  onChange={handleModuleChange}
                  label="Module Code"
                  required
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

            {/*ALLCHANGE connect to database. autofill phone model based on work order ID.*/}
            <div className="form-group">
              <TextField
                label="Phone model AUTOFILL"
                variant="outlined"
                type="text"
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                required
                fullWidth
              />
            </div>

            {/*ALLCHANGE connect to database.
            - fucntion should autofill to work order request date*/}
            <div className="form-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date requested"
                  value={
                    formData.requestDate ? dayjs(formData.requestDate) : null
                  }
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      requestDate: newValue
                        ? newValue.format("YYYY-MM-DD")
                        : "",
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </div>

            {/*ALLCHANGE name of employee.*/}
            <div className="form-group">
              <TextField
                label="Reporter"
                variant="outlined"
                type="text"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                required
                fullWidth
              />
            </div>

            <div className="form-group">
              <TextField
                label="Quantity Produced"
                variant="outlined"
                type="number"
                value={formData.quantityProduced}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantityProduced: parseInt(e.target.value),
                  })
                }
                required
                fullWidth
              />
            </div>

            {/*ALLCHANGE connect to database. fulfillment date.
            - fucntion should autofill to current date*/}
            <div className="form-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date fulfilled"
                  value={
                    formData.requestDate ? dayjs(formData.requestDate) : null
                  }
                  onChange={(newValue) =>
                    setFormData({
                      ...formData,
                      requestDate: newValue
                        ? newValue.format("YYYY-MM-DD")
                        : "",
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </div>

            <Button
              type="submit"
              variant="contained"
              disableElevation
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
                disableElevation
                startIcon={<CancelIcon />}
                onClick={() => setEditMode(null)}
              >
                Cancel
              </Button>
            )}
          </form>
        </div>
        <div className="preview-card">
          <h2>Report preview</h2>
          {/* Preview Card */}
          {formData.moduleCode && (
            <div className="preview-content">
              {
                moduleOptions.find(
                  (option) => option.code === formData.moduleCode
                )?.icon
              }
              <p>{formData.description}</p>
            </div>
          )}
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
