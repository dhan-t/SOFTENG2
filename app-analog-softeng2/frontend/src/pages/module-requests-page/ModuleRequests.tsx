import React, { useState } from "react";
import { useLogistics } from "../../hooks/useLogistics";
import "./ModuleRequests.css";
import Header from "../components/Header";

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

  return (
    <div className="main-div">
      <Header />

      <div className="form-and-card">
        {/* Submit Request Form */}
        <div className="logistics-request">
          <form onSubmit={handleSubmit} className="form">
            <h2 className="h2">Module Request</h2>

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

            <div className="form-group">
              <label htmlFor="requestedBy">Requested By</label>
              <input
                type="text"
                id="requestedBy"
                placeholder="Requested By"
                value={formData.requestedBy}
                onChange={(e) =>
                  setFormData({ ...formData, requestedBy: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipient">Recipient</label>
              <input
                type="text"
                id="recipient"
                placeholder="Recipient"
                value={formData.recipient}
                onChange={(e) =>
                  setFormData({ ...formData, recipient: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requestDate">Request Date</label>
              <input
                type="date"
                id="requestDate"
                value={formData.requestDate}
                onChange={(e) =>
                  setFormData({ ...formData, requestDate: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                placeholder="Quantity"
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

            <button type="submit">Submit Request</button>
          </form>
        </div>
        <div className="preview-card">
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
      {/* Existing Requests */}
      <div>
        <h2>Existing Requests</h2>
        <table className="styled-table">
          <thead>
            <tr className="row">
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
