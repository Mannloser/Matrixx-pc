const nodemailer = require("nodemailer");

const { getWelcomeEmailHtml } = require("./matrixx-welcome-email");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASS
    }
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