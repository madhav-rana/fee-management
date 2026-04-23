const transporter = require("../config/mailer");

async function sendOtpEmail(adminEmail, otp) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: "OTP for account verification",
      text: `OTP for account verification is : ${otp}`,
    });
  } catch(err) {
    console.error(`Email failed for ${adminEmail}:`, err.message);
    throw err; // re-throw so that controller knows
  }
}

module.exports = sendOtpEmail;