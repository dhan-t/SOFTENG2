import { useState } from "react";

export const useReports = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (productionData: any, logisticsData: any, trackingData: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productionData, logisticsData, trackingData }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL object
        return true;
      } else {
        setError("Failed to generate report.");
        return false;
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError("An error occurred.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { generateReport, loading, error };
};