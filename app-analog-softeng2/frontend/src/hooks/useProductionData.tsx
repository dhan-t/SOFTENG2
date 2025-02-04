import { useState, useEffect } from "react";

interface ProductionData {
  productId: string;
  productName: string;
  quantityProduced: number;
  dateProduced: string;
}

export const useProductionData = () => {
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductionData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/production");
      if (!res.ok) throw new Error("Failed to fetch production data");
      const data = await res.json();
      setProductionData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addProductionData = async (newData: ProductionData) => {
    try {
      const res = await fetch("http://localhost:5001/api/production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) await fetchProductionData();
    } catch (err) {
      setError("Failed to add production data.");
    }
  };

  const updateProductionData = async (updatedData: ProductionData) => {
    try {
      const res = await fetch("http://localhost:5001/api/production", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) await fetchProductionData();
    } catch (err) {
      setError("Failed to update production data.");
    }
  };

  const deleteProductionData = async (productId: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/production", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) await fetchProductionData();
    } catch (err) {
      setError("Failed to delete production data.");
    }
  };

  useEffect(() => {
    fetchProductionData();
  }, []);

  return {
    productionData,
    fetchProductionData,
    addProductionData,
    updateProductionData,
    deleteProductionData,
    loading,
    error,
  };
};