const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { getWelcomeEmailHtml } = require("./matrixx-welcome-email");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4, // 👈 FORCE IPv4 (THIS FIXES YOUR ERROR)
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendWelcomeEmail = async (email, name) => {
    console.log("🚀 EMAIL FUNCTION CALLED for:", email);

    try {
        console.log("📧 Trying to send email...");

        await transporter.sendMail({
            from: process.env.MAILING_USER,
            to: email,
            subject: "Welcome to Matrixx 🖥️",
            html: getWelcomeEmailHtml(name)
        });

        console.log("✅ Email actually sent");
        return true;

    } catch (err) {
        console.log("❌ EMAIL ERROR FULL:", err);
        return false;
    }
};

module.exports = sendWelcomeEmail;