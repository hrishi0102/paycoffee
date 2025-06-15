import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./db.js";
import authRoutes from "./routes/auth.js";
import widgetRoutes from "./routes/widgets.js";
import paymentRoutes from "./routes/payments.js";
import embedRoutes from "./routes/embed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://paycoffee.vercel.app",
      "*",
    ], // Allow all origins for embed
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/widgets", widgetRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/embed", embedRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
