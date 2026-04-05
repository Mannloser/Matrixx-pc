const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const partsRoutes = require("./routes/partsRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

const startServer = async () => {
    try {
        await connectDB();
        app.listen(5001, () => console.log("✅ Server running on port 5001"));
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();