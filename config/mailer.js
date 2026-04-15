
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS  //this must be App Password not your Gmail password
//   }
// });

// transporter.verify((err, success) => {
//   if (err) {
//     console.error("❌ SMTP ERROR:", err.message);
//   } else {
//     console.log("✅ Gmail SMTP ready");
//   }
// });


// module.exports = transporter;


// // If EMAIL_PASS is your actual Gmail password it won't work — Gmail requires an App Password (generated from Google Account → Security → 2FA → App Passwords)




const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,

  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  //this must be App Password not your Gmail password
  }

});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err.message);
  } else {
    console.log("✅ Gmail SMTP ready");
  }
});


module.exports = transporter;


module.exports = transporter;


