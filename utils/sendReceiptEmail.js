// async function sendReceiptEmail(studentEmail, pdfBuffer, receiptNumber) {
//   const transporter = require("../config/mailer");

//   await transporter.sendMail({
//     // from: process.env.EMAIL_FROM,
//     from: "siddharthpant9120@gmail.com",
//     to: studentEmail,
//     subject: "Fee Payment Receipt",
//     text: "Please find your fee payment receipt attached.",
//     attachments: [
//       {
//         filename: `${receiptNumber}.pdf`,
//         content: pdfBuffer
//       }
//     ]
//   });
// }



// module.exports = sendReceiptEmail;



const transporter = require("../config/mailer");

async function sendReceiptEmail(studentEmail, pdfBuffer, receiptNumber) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      // to: studentEmail,
      to: process.env.EMAIL_TO,
      subject: "Fee Payment Receipt",
      text: "Please find your fee payment receipt attached.",
      attachments: [
        {
          filename: `${receiptNumber}.pdf`,
          content: pdfBuffer
        }
      ]
    });
  } catch(err) {
    console.error(`Email failed for ${studentEmail}:`, err.message);
    throw err; // re-throw so that controller knows
  }
}

module.exports = sendReceiptEmail;