import React, { useState } from "react";
import { useLogistics } from "../../hooks/useLogistics";
import "./ModuleRequests.css";
import Header from "../components/Header";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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

// Define your module options with icons
const moduleOptions = [
  { code: "CMR123", description: "Camera module", icon: <CameraIcon /> },
  { code: "HSN123", description: "Housing module", icon: <RectangleIcon /> },
  { code: "SPK123", description: "Speaker module", icon: <SpeakerIcon /> },
];

const Logistics: React.FC = () => {
  const { requests, submitRequest, loading, error } = useLogistics();
  const [formData, setFormData] = useState({
    module: "",
    requestedBy: "",
    description: "",
    recipient: "",
    requestDate: "",
    quantity: 0,
  });

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = moduleOptions.find(
      (option) => option.code === event.target.value
    );

    setFormData({
      ...formData,
      module: selectedOption?.code || "",
      description: selectedOption?.description || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRequest(formData);
    setFormData({
      module: "",
      requestedBy: "",
      description: "",
      recipient: "",
      requestDate: "",
      quantity: 0,
    });
  };

  const rows = requests.map((request, index) => ({
    index: index + 1, // Add index starting from 1
    id: request._id, // Use _id as the unique ID
    module: request.module,
    requestedBy: request.requestedBy,
    recipient: request.recipient, // Add recipient field
    status: request.status,
  }));

  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 20, maxWidth: 20 },
    { field: "id", headerName: "Request ID", width: 150, flex: 1 },
    { field: "module", headerName: "Module", width: 250, sortable: true },
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

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="main-div">
      <Header />

      <div className="form-and-card">
        {/* Submit Request Form */}
        <div className="form-holder">
          <form onSubmit={handleSubmit} className="form">
            <h2 className="h2">Module Request</h2>
            {/* 
            <div className="form-group">
              <label htmlFor="module">Module Code</label>
              <select
                id="module"
                value={formData.module}
                onChange={handleModuleChange}
                required
              >
                <option value="">Select Module</option>
                {moduleOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.code} - {option.description}
                  </option>
                ))}
              </select>
            </div>
            */}
            <div className="form-group">
              <TextField
                type="text"
                id="requestedBy"
                label="Requested by"
                value={formData.requestedBy}
                onChange={(e) =>
                  setFormData({ ...formData, requestedBy: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <TextField
                type="text"
                id="description"
                label="Module name"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <TextField
                type="text"
                id="recipient"
                label="Recipient"
                value={formData.recipient}
                onChange={(e) =>
                  setFormData({ ...formData, recipient: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Produced"
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
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </div>
            <div className="form-group">
              <TextField
                type="number"
                id="quantity"
                label="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              color={"success"}
              startIcon={<SendIcon />}
            >
              {"submit"}
            </Button>
          </form>
        </div>
        <div className="preview-card">
          {/* Preview Card */}
          <h2>Request preview</h2>
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
      {/* Existing Requests */}
      <div style={{ height: 400, width: "100%" }}>
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
    </div>
  );
};

export default Logistics;
