// async function sendReceiptEmail(studentEmail, pdfBuffer, receiptNumber) {
//   const transporter = require("../config/mailer");

//   await transporter.sendMail({
//     // from: "College Fee System <collegefee@gmail.com>",
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
      to: "ranamadhavsingh@hotmail.com",
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
    throw err; // re-throw so controller knows
  }
}

module.exports = sendReceiptEmail;