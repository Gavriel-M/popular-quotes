const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
      debug: false,
      logger: true,
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: html,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email was not sent");
  }
};

module.exports = sendEmail;
