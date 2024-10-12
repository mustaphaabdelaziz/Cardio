// Import nodemailer
const nodemailer = require("nodemailer");

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secureConnection: process.env.SECURE_CONNECTION,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  // tls: {
  //   ciphers: "SSLv3",
  //   secureProtocol: "TLSv1_method", // Add this line
  // },
});
module.exports.sendMail = (email, token) => {
  // send mail with defined transport object
  transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Password Reset",
    text:
   "Veuillez cliquer sur le lien pour changer votre mot de passe: " +
      process.env.SERVER_URL +
      "user/reset-password/" +
      token,
  });
};
