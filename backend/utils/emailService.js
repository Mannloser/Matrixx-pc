const { Resend } = require("resend");
const dotenv = require("dotenv");
dotenv.config();

const { getWelcomeEmailHtml } = require("./matrixx-welcome-email");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  console.log("🚀 EMAIL FUNCTION CALLED for:", email);

  try {
    console.log("📧 Trying to send email...");

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to Matrixx 🖥️",
      html: getWelcomeEmailHtml(name)
    });

    console.log("✅ Email sent via Resend");
    return true;

  } catch (err) {
    console.log("❌ EMAIL ERROR FULL:", err);
    return false;
  }
};

module.exports = sendWelcomeEmail;