const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { getWelcomeEmailHtml } = require("./matrixx-welcome-email");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,        // 👈 IMPORTANT (not 465)
    secure: false,    // 👈 IMPORTANT
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASS,
    },
});

const sendWelcomeEmail = async (email, name) => {  // ✅ accept name
    try {
        await transporter.sendMail({
            from: `"Matrixx" <${process.env.MAILING_USER}>`,
            to: email,
            subject: "Welcome to Matrixx 🖥️",
            html: getWelcomeEmailHtml(name)  // ✅ pass name
        });

        return true;
    } catch (err) {
        console.log("EMAIL ERROR:", err);
        return false;
    }
};

module.exports = sendWelcomeEmail;