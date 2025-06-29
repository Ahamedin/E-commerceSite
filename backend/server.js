import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import passport from "./config/passport.js"; // Ensure this is properly configured
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/auth.js";
import securityMiddleware from "./lib/ratelimit.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Logging port
console.log("Server running on port", PORT);

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(securityMiddleware);

// ✅ UPDATED CORS SETTINGS
const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "https://e-commercesite-6g9s.onrender.com", // Deployed frontend
];

app.use(cors({
  origin: ["http://localhost:3000", "https://e-commercesite-6g9s.onrender.com"],
  credentials: true
}));


// Routes
app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/e-commerce/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "e-commerce", "dist", "index.html"));
  });
}

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
