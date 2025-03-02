import React, { useState, useEffect } from "react";
import { useProductionData } from "../../hooks/useProductionData";
import { useWorkOrders } from "../../hooks/useWorkOrder";
import "./ReportProduction.css";
import "../components/global.css";
import Header from "../components/Header";

import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const ReportProduction: React.FC = () => {
  const { productionData, fetchProductionData, addProductionData } =
    useProductionData();
  const { workOrders, loading, error } = useWorkOrders(); // Used only for autofill

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantityProduced: 0,
    dateProduced: dayjs().format("YYYY-MM-DD"),
    dateRequested: "",
    quantityRequested: 0,
    fulfilledBy: "",
  });

  useEffect(() => {
    fetchProductionData();
  }, []);

  // Handle Work Order Selection for Autofill
  const handleWorkOrderChange = (event: any) => {
    const selectedId = event.target.value;
    const selectedOrder = workOrder.find((order) => order._id === selectedId);

    if (selectedOrder) {
      setFormData({
        ...formData,
        productId: selectedOrder._id ?? "",
        productName: selectedOrder.module, // Assuming 'module' represents the product name
        dateRequested: selectedOrder.createdDate ?? "",
        quantityRequested: selectedOrder.quantity ?? 0,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure all fields are passed correctly
    const newEntry = {
      productId: formData.productId,
      productName: formData.productName,
      quantityProduced: formData.quantityProduced,
      dateProduced: formData.dateProduced,
      dateRequested: formData.dateRequested, // From work order
      quantityRequested: formData.quantityRequested, // From work order
      fulfilledBy: formData.fulfilledBy, // Manually entered
    };

    try {
      const response = await addProductionData(newEntry);
      console.log("Production data added:", response);
    } catch (error) {
      console.error("Error adding production data:", error);
      alert("Failed to add production data. Check console for details.");
    }

    // Reset form after submission
    setFormData({
      productId: "",
      productName: "",
      quantityProduced: 0,
      dateProduced: dayjs().format("YYYY-MM-DD"),
      dateRequested: "",
      quantityRequested: 0,
      fulfilledBy: "",
    });
  };

  return (
    <div className="main-div">
      <Header />

      <div className="form-and-card">
        <div className="form-holder">
          <form onSubmit={handleSubmit} className="form">
            <h2>Report Production</h2>

            {/* Select Work Order (Autofill) */}
            <div className="form-group">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Work Order</InputLabel>
                <Select
                  value={formData.productId}
                  onChange={handleWorkOrderChange}
                  label="Select Work Order"
                  required
                >
                  <MenuItem value="">
                    <em>Select Work Order</em>
                  </MenuItem>
                  {workOrders.map((order) => (
                    <MenuItem key={order._id} value={order._id}>
                      {order._id} - {order.module}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Product Name (Autofilled) */}
            <div className="form-group">
              <TextField
                label="Product Name"
                variant="outlined"
                type="text"
                value={formData.productName}
                fullWidth
                disabled
              />
            </div>

            {/* Date Requested (Autofilled) */}
            <div className="form-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Requested"
                  value={
                    formData.dateRequested
                      ? dayjs(formData.dateRequested)
                      : null
                  }
                  disabled
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </div>

            {/* Quantity Requested (Autofilled) */}
            <div className="form-group">
              <TextField
                label="Quantity Requested"
                variant="outlined"
                type="number"
                value={formData.quantityRequested}
                fullWidth
                disabled
              />
            </div>

            {/* Fulfilled by (Manually Entered) */}
            <div className="form-group">
              <TextField
                label="Fulfilled by"
                variant="outlined"
                type="text"
                value={formData.fulfilledBy}
                onChange={(e) =>
                  setFormData({ ...formData, fulfilledBy: e.target.value })
                }
                required
                fullWidth
              />
            </div>

            {/* Quantity Produced */}
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

            {/* Date Produced (Defaults to today) */}
            <div className="form-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Produced"
                  value={dayjs(formData.dateProduced)}
                  onChange={(newDate) =>
                    setFormData({
                      ...formData,
                      dateProduced: dayjs(newDate).format("YYYY-MM-DD"),
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
            >
              Add Report
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportProduction;
