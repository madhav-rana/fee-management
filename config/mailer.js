<<<<<<< HEAD
=======
// const nodemailer = require("nodemailer");
>>>>>>> f8cce1abd75fec5e5c9920a50307a71388eaeb0b

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



<<<<<<< HEAD

=======
>>>>>>> f8cce1abd75fec5e5c9920a50307a71388eaeb0b
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
<<<<<<< HEAD

=======
>>>>>>> f8cce1abd75fec5e5c9920a50307a71388eaeb0b
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
<<<<<<< HEAD

  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  //this must be App Password not your Gmail password
  }

=======
>>>>>>> f8cce1abd75fec5e5c9920a50307a71388eaeb0b
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err.message);
  } else {
    console.log("✅ Gmail SMTP ready");
  }
});

<<<<<<< HEAD

module.exports = transporter;


module.exports = transporter;


=======
module.exports = transporter;
>>>>>>> f8cce1abd75fec5e5c9920a50307a71388eaeb0b
