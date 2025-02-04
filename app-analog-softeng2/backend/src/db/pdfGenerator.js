import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generatePDF = async (productionData, logisticsData, trackingData) => {
  try {
    console.log("Generating PDF with data:", { productionData, logisticsData, trackingData });

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Increase height to accommodate more content
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50; // Start from the top of the page

    // Function to add text to the PDF
    const addText = (text, size = 12, x = 50) => {
      page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 10; // Move down for the next line
    };

    // Add Production Data Summary
    addText("Production Data Summary", 18);
    if (productionData.length > 0) {
      productionData.forEach((item) => {
        addText(`Product: ${item.productName}, Quantity: ${item.quantityProduced}, Date: ${item.dateProduced}`);
      });
    } else {
      addText("No production data available.");
    }

    y -= 20; // Add extra space between sections

    // Add Logistics Summary
    addText("Logistics Summary", 18);
    if (logisticsData.length > 0) {
      logisticsData.forEach((item) => {
        addText(`Module: ${item.module}, Requested By: ${item.requestedBy}, Status: ${item.status}`);
      });
    } else {
      addText("No logistics data available.");
    }

    y -= 20; // Add extra space between sections

    // Add Tracking Summary
    addText("Tracking Summary", 18);
    if (trackingData.length > 0) {
      trackingData.forEach((item) => {
        addText(`Module: ${item.module}, Status: ${item.status}, Updated By: ${item.updatedBy}, Date: ${item.updatedAt}`);
      });
    } else {
      addText("No tracking data available.");
    }

    // Save the PDF and return the buffer
    const pdfBytes = await pdfDoc.save();
    console.log("PDF generated successfully.");
    return pdfBytes;
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
};