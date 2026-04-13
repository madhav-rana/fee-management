const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");

async function generatePDF(viewPath, data) {
  const browser = await puppeteer.launch({
    headless: "new"
  });

  const page = await browser.newPage();

  // Render EJS to HTML
  const html = await ejs.renderFile(viewPath, data);

  await page.setContent(html, {
    waitUntil: "networkidle0"
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px"
    }
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePDF;