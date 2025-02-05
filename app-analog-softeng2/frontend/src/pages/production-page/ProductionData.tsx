import React, { useState, useEffect } from "react";
import { useProductionData } from "../../hooks/useProductionData";
import "./ProductionData.css";
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
  icon: JSX.Element; // Use JSX.Element for icon
}

const ProductionData: React.FC = () => {
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

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = moduleOptions.find(
      (option) => option.code === event.target.value
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-div">
      <Header />

      <div className="form-and-card">
        <div className="report-production">
          <form onSubmit={handleSubmit} className="form">
            <h2>{editMode ? "Edit report" : "Report production"}</h2>

            <div className="form-group">
              <label htmlFor="productId">Product ID</label>
              <input
                type="text"
                placeholder="Product ID"
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantityProduced">Quantity Produced</label>
              <input
                type="number"
                placeholder="Quantity Produced"
                value={formData.quantityProduced}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantityProduced: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateProduced">Date Produced</label>
              <input
                type="date"
                value={formData.dateProduced}
                onChange={(e) =>
                  setFormData({ ...formData, dateProduced: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="moduleCode">Module Code</label>
              <select
                value={formData.moduleCode}
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
              <label htmlFor="description">Description</label>
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                readOnly
              />
            </div>

            <button type="submit">{editMode ? "Update" : "Add"}</button>
            {editMode && (
              <button type="button" onClick={() => setEditMode(null)}>
                Cancel
              </button>
            )}
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

      {/* Production Data Table */}
      <table className="styled-table">
        <thead>
          <tr className="row">
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity Produced</th>
            <th>Date Produced</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productionData.map((item) => (
            <tr key={item.productId} className="row">
              <td>{item.productId}</td>
              <td>{item.productName}</td>
              <td>{item.quantityProduced}</td>
              <td>{new Date(item.dateProduced).toLocaleDateString()}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteProductionData(item.productId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionData;
