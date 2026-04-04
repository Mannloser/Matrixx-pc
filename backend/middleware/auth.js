const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            console.warn("⚠️ Auth: No token provided");
            return res.status(401).json({ message: "No token provided. Authorization denied." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        console.log("✅ Auth: Token verified successfully");
        console.log("User ID from token:", decoded.id);
        
        next();
    } catch (error) {
        console.error("❌ Auth error:", error.message);
        res.status(401).json({ message: "Token is invalid or expired" });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    if (req.user.role !== "admin") {
        console.warn(`⛔ Admin access denied for user: ${req.user.id} (role: ${req.user.role})`);
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { auth, adminOnly };
