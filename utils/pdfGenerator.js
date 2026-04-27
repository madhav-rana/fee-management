const htmlPdf = require("html-pdf-node");
const ejs = require("ejs");

async function generatePDF(viewPath, data) {
  const html = await ejs.renderFile(viewPath, data);

  const file = { content: html };

  const options = {
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px"
    }
  };

  const pdfBuffer = await htmlPdf.generatePdf(file, options);
  return pdfBuffer;
}

module.exports = generatePDF;