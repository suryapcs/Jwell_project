process.env.DOTENV_LOG = "false"; // disable dotenv logs
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

// Import DB connection
require("../backend/config/db");

// Import routes
const customerRegistraionRoutes = require("./routes/customerRegistraionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const interestRoutes = require("./routes/interestDetailsRoutes");
const jewelleryRoutes = require("./routes/jewelleryRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // From .env
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // From .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Use secure:true only on HTTPS
  })
);

// Routes
app.use("/api/customer", customerRegistraionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/jewellery", jewelleryRoutes);
app.use("/api/stats", statsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
