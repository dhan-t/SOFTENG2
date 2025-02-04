import React, { useState } from "react";
import { useLogistics } from "../../hooks/useLogistics";
import "./Logistics.css";
import Header from "../components/Header";

const Logistics = () => {
  const { requests, submitRequest, loading, error } = useLogistics();
  const [formData, setFormData] = useState({
    module: "",
    requestedBy: "",
    description: "",
    recipient: "",
    requestDate: "",
    quantity: 0,
  });

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

  return (
    <div className="logistics">
      <Header />

      {/* Submit Request Form */}
      <form onSubmit={handleSubmit}>
        <div className="section">
          <h2 className="h2">Logistics Request</h2>

          <div className="form-grid">
            <input
              type="text"
              placeholder="Module"
              value={formData.module}
              onChange={(e) =>
                setFormData({ ...formData, module: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Requested By"
              value={formData.requestedBy}
              onChange={(e) =>
                setFormData({ ...formData, requestedBy: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Recipient"
              value={formData.recipient}
              onChange={(e) =>
                setFormData({ ...formData, recipient: e.target.value })
              }
              required
            />
            <input
              type="date"
              value={formData.requestDate}
              onChange={(e) =>
                setFormData({ ...formData, requestDate: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <button type="submit">Submit Request</button>
        </div>
      </form>
      {/* Existing Requests */}
      <div>
        <h2>Existing Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Requested By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.module}</td>
                <td>{request.requestedBy}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logistics;
