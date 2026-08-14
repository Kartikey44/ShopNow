import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ email, name, subject, html, text }) => {
  const mailOptions = {
    from: `"ShopNow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
};
