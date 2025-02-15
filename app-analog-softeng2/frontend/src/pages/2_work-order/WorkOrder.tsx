import React, { useState } from "react";
import { useWorkOrders } from "../../hooks/useWorkOrder";
import "./WorkOrder.css";
import Header from "../components/Header";
import "../components/global.css";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Define icons
const PhoneIcon = () => (
  <span role="img" aria-label="phone">
    📱
  </span>
);
const FactoryIcon = () => (
  <span role="img" aria-label="factory">
    🏭
  </span>
);

// Define phone models
const phoneOptions = [
  { code: "Galaxy S25", description: "Base model", icon: <PhoneIcon /> },
  { code: "Galaxy S25+", description: "Middle model", icon: <PhoneIcon /> },
  { code: "Galaxy S25U", description: "Top-tier model", icon: <PhoneIcon /> },
];

// Define factory list
const factoryList = [
  { code: "Factory A", description: "Basic factory", icon: <FactoryIcon /> },
  { code: "Factory B", description: "Middle factory", icon: <FactoryIcon /> },
  { code: "Factory C", description: "Top-tier factory", icon: <FactoryIcon /> },
];

const WorkOrder: React.FC = () => {
  const { workOrders, submitWorkOrder } = useWorkOrders();

  const rows = workOrders.map((order: any, index: number) => ({
    id: order._id,
    index: index + 1,
    phone: order.module, // Ensure this matches your database field
    requestedBy: order.createdBy, // Ensure this matches your database field
    recipient: order.assignedTo, // Ensure this matches your database field
    quantity: order.quantity, // Ensure this matches your database field
    status: order.status,
  }));

  // Form state
  const [formData, setFormData] = useState({
    module: "",
    requestedBy: "",
    description: "",
    recipient: "",
    requestDate: "",
    quantity: 0,
  });

  const handlePhoneChange = (event: SelectChangeEvent<string>) => {
    const selectedOption = phoneOptions.find(
      (option) => option.code === event.target.value
    );
    setFormData({
      ...formData,
      module: selectedOption?.code || "",
      description: selectedOption?.description || "",
    });
  };

  const handleFactoryChange = (event: SelectChangeEvent<string>) => {
    const selectedFactory = factoryList.find(
      (option) => option.code === event.target.value
    );
    setFormData({ ...formData, recipient: selectedFactory?.code || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      module: formData.module, // Use module directly
      createdBy: formData.requestedBy,
      description: formData.description,
      assignedTo: formData.recipient,
      createdDate: formData.requestDate,
      dueDate: formData.requestDate,
      priority: "Medium",
      quantity: formData.quantity,
    };

    console.log("Submitting:", formattedData);

    try {
      const success = await submitWorkOrder(formattedData);
      if (success) {
        console.log("Submission successful!");
        setFormData({
          module: "",
          requestedBy: "",
          description: "",
          recipient: "",
          requestDate: "",
          quantity: 0,
        });
      } else {
        console.error("Failed to submit work order.");
      }
    } catch (error) {
      console.error("Error submitting work order:", error);
    }
  };

  {
    /*Columns creation*/
  }
  const columns: GridColDef[] = [
    { field: "index", headerName: "ID", width: 50 },
    { field: "id", headerName: "Request ID", width: 250, flex: 1 },
    { field: "phone", headerName: "Phone", width: 100, sortable: true },
    {
      field: "requestedBy",
      headerName: "Requested By",
      width: 200,
      sortable: true,
    },
    { field: "recipient", headerName: "Recipient", width: 200, sortable: true },
    { field: "quantity", headerName: "Quantity", width: 100, sortable: true },
    { field: "status", headerName: "Status", width: 150, sortable: true },
  ];

  return (
    <div className="main-div">
      <Header />
      <div className="form-and-card">
        <div className="form-holder">
          <form onSubmit={handleSubmit} className="form">
            <h2 className="h2">Create work order</h2>

            <div className="form-group">
              {/*ALLCHANGE list all phone models to be created.*/}
              <FormControl fullWidth required>
                <InputLabel id="phone-label">Phone model</InputLabel>
                <Select
                  labelId="phone-label"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                >
                  <MenuItem value="">
                    <em>Select model</em>
                  </MenuItem>
                  {phoneOptions.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.code} - {option.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

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

            {/*ALLCHANGE  list all factories. 
            Recipient parin, pero factory na ang reciever*/}
            <div className="form-group">
              <FormControl fullWidth required>
                <InputLabel id="recipient-label">Assign factory</InputLabel>
                <Select
                  labelId="recipient-label"
                  id="recipient"
                  value={formData.recipient}
                  onChange={handleFactoryChange}
                >
                  <MenuItem value="">
                    <em>Assign factory</em>
                  </MenuItem>
                  {factoryList.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.code} - {option.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/*ALLCHANGE  autofill function, will always fill to today.*/}
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
              Submit
            </Button>
          </form>
        </div>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <h2>Existing work orders</h2>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default WorkOrder;
