import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateChartImage = async (chartConfig) => {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  return await chartJSNodeCanvas.renderToBuffer(chartConfig);
};

export const generatePDF = async (
  productionData,
  logisticsData,
  trackingData
) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const createNewPage = () => {
      const newPage = pdfDoc.addPage([600, 850]);
      return { newPage, y: 800 };
    };

    let { newPage: page, y } = createNewPage();
    const { width, height } = page.getSize();

    // Add Company Header & Logo (Smaller Size)
    const logoPath = path.join(__dirname, "company_logo.png");
    if (fs.existsSync(logoPath)) {
      const logoImageBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoDims = logoImage.scale(0.15);
      page.drawImage(logoImage, {
        x: width / 2 - logoDims.width / 2,
        y: y - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
      y -= logoDims.height + 10;
    }

    // Report Title & Date
    page.drawText("Manufacturing Production Report", {
      x: 50,
      y,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 400,
      y,
      size: 12,
      font,
    });
    y -= 30;

    // Summary Statistics
    const totalProduced = productionData.reduce(
      (sum, item) => sum + (item.producedQty || 0),
      0
    );
    const totalLogistics = logisticsData.length;
    const totalCompletedTracking = trackingData.filter(
      (item) => item.status === "Completed"
    ).length;

    page.drawText(`Total Production Quantity: ${totalProduced}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 15;
    page.drawText(`Total Logistics Requests: ${totalLogistics}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 15;
    page.drawText(`Total Completed Deliveries: ${totalCompletedTracking}`, {
      x: 50,
      y,
      size: 12,
      font,
    });
    y -= 30;

    // Charts Configurations
    const chartConfigs = [
      {
        type: "bar",
        data: {
          labels: productionData.map((i) => i.dateFulfilled || "N/A"),
          datasets: [
            {
              label: "Produced Quantity",
              data: productionData.map((i) => i.producedQty || 0),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
      },
      {
        type: "pie",
        data: {
          labels: [...new Set(logisticsData.map((i) => i.status || "N/A"))],
          datasets: [
            {
              data: logisticsData.reduce(
                (acc, i) => ((acc[i.status] = (acc[i.status] || 0) + 1), acc),
                {}
              ),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        },
      },
      {
        type: "bar",
        data: {
          labels: trackingData.map((i) => i.phoneModel || "N/A"),
          datasets: [
            {
              label: "Delivered Quantity",
              data: trackingData.map((i) => i.quantity || 0),
              backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
          ],
        },
      },
      {
        type: "line",
        data: {
          labels: productionData.map((i) => i.dateRequested || "N/A"),
          datasets: [
            {
              label: "Production Requests Over Time",
              data: productionData.map((i) => i.producedQty || 0),
              borderColor: "#FF6384",
            },
          ],
        },
      },
      {
        type: "doughnut",
        data: {
          labels: [...new Set(trackingData.map((i) => i.status || "N/A"))],
          datasets: [
            {
              data: trackingData.reduce(
                (acc, i) => ((acc[i.status] = (acc[i.status] || 0) + 1), acc),
                {}
              ),
              backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
            },
          ],
        },
      },
    ];

    for (const chartConfig of chartConfigs) {
      if (y < 250) {
        ({ newPage: page, y } = createNewPage());
      }
      const chartImage = await generateChartImage(chartConfig);
      const chartImageEmbed = await pdfDoc.embedPng(chartImage);
      const chartDims = chartImageEmbed.scale(0.5);
      y -= chartDims.height;
      page.drawImage(chartImageEmbed, {
        x: width / 2 - chartDims.width / 2,
        y: y,
        width: chartDims.width,
        height: chartDims.height,
      });
      y -= 30;
    }

    // Footer
    page.drawText("Generated by Analog", {
      x: width / 2 - 80,
      y: 20,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    return await pdfDoc.save();
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
};
