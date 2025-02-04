import React, { useState, useEffect } from "react";
import { useProductionData } from "../../hooks/useProductionData";
import "./ProductionData.css";
import Header from "../components/Header";

interface ProductionData {
  productId: string;
  productName: string;
  quantityProduced: number;
  dateProduced: string;
}

const ProductionData = () => {
  const {
    productionData,
    fetchProductionData,
    addProductionData,
    updateProductionData,
    deleteProductionData,
    loading,
    error,
  } = useProductionData();

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantityProduced: 0,
    dateProduced: "",
  });
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    fetchProductionData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
    });
    setEditMode(null);
  };

  const handleEdit = (item: ProductionData) => {
    setFormData({
      productId: item.productId,
      productName: item.productName,
      quantityProduced: item.quantityProduced,
      dateProduced: item.dateProduced.split("T")[0],
    });
    setEditMode(item.productId);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="production-data">
      <Header />
      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="form">
        <h2>{editMode ? "Edit Production Data" : "Add Production Data"}</h2>
        <input
          type="text"
          placeholder="Product ID"
          value={formData.productId}
          onChange={(e) =>
            setFormData({ ...formData, productId: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={formData.productName}
          onChange={(e) =>
            setFormData({ ...formData, productName: e.target.value })
          }
          required
        />
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
        <input
          type="date"
          value={formData.dateProduced}
          onChange={(e) =>
            setFormData({ ...formData, dateProduced: e.target.value })
          }
          required
        />
        <button type="submit">{editMode ? "Update" : "Add"}</button>
        {editMode && (
          <button type="button" onClick={() => setEditMode(null)}>
            Cancel
          </button>
        )}
      </form>

      {/* Production Data Table */}
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity Produced</th>
            <th>Date Produced</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productionData.map((item) => (
            <tr key={item.productId}>
              <td>{item.productId}</td>
              <td>{item.productName}</td>
              <td>{item.quantityProduced}</td>
              <td>{new Date(item.dateProduced).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => deleteProductionData(item.productId)}>
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
