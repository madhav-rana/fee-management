// utils/exportPDF.js
const generatePDF = require("./pdfGenerator");
const path = require("path");

async function exportPDF(res, viewName, viewData, filename) {
  const pdfBuffer = await generatePDF(
    path.join(__dirname, `../views/report/pdf/${viewName}.ejs`),
    viewData
  );

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${filename}.pdf`,
  });

  return res.send(pdfBuffer);
}

module.exports = exportPDF;