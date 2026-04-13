// const PDFDocument = require("pdfkit");

// function generateReceiptPDF(payment) {
//   return new Promise((resolve) => {
//     // doc.on("error", reject); // ✅ add this
//     const doc = new PDFDocument({ size: "A4", margin: 50 });
//     const buffers = [];

//     doc.on("data", buffers.push.bind(buffers));
//     doc.on("end", () => {
//       const pdfData = Buffer.concat(buffers);
//       resolve(pdfData);
//     });

//     // ===== PDF CONTENT =====
//     doc.fontSize(18).text("Fee Payment Receipt", { align: "center" });
//     doc.moveDown();

//     doc.fontSize(12).text(`Receipt No: ${payment.receiptNumber}`);
//     doc.text(`Student Name: ${payment.student.name}`);
//     doc.text(`Roll No: ${payment.student.rollNo}`);
//     doc.text(`Course: ${payment.student.course}`);
//     doc.text(`Branch: ${payment.student.branch.name}`);
//     doc.moveDown();

//     doc.text(`Amount Paid: ₹${payment.amountPaid}`);
//     doc.text(`Payment Mode: ${payment.paymentMode}`);
//     // doc.text(`Payment Date: ${payment.paymentDate.toLocaleDateString()}`);
//     doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);

//     doc.moveDown(2);
//     doc.text("This is a system generated receipt.", { align: "center" });

//     doc.end();
//   });
// }

// module.exports = generateReceiptPDF;


const PDFDocument = require("pdfkit");

function generateReceiptPDF(payment) {
  return new Promise((resolve, reject) => {  // ✅
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("error", reject);  // ✅
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(18).text("Fee Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Receipt No: ${payment.receiptNumber}`);
    doc.text(`Student Name: ${payment.student.name}`);
    doc.text(`Roll No: ${payment.student.rollNo}`);
    doc.text(`Course: ${payment.student.course}`);
    doc.text(`Branch: ${payment.student.branch.name}`);
    doc.moveDown();

    doc.text(`Amount Paid: ₹${payment.amountPaid}`);
    doc.text(`Fine Applied: ₹${payment.fineApplied || 0}`);  // ✅
    doc.text(`Payment Mode: ${payment.paymentMode}`);
    doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);

    doc.moveDown(2);
    doc.text("This is a system generated receipt.", { align: "center" });

    doc.end();
  });
}

module.exports = generateReceiptPDF;