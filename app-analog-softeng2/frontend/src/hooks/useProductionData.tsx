import { useState, useEffect } from "react";

interface ProductionData {
  id?: string;
  workOrderID: string;
  dateRequested: string;
  fulfilledBy: string;
  dateFulfilled: string;
  producedQty: number;
  orderFulfilled: boolean;
  orderOnTime: boolean;
  phoneModel?: string; // Add phone model to ProductionData
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
      else {
        const errorText = await res.text();
        console.error("Failed to add production data:", errorText);
        setError("Failed to add production data.");
      }
    } catch (err) {
      console.error("Error adding production data:", err);
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
  
  const deleteProductionData = async (id: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/production", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
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