import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("owners")
      .select("count")
      .limit(1);

    if (error) throw error;

    res.json({
      message: "Database connected successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
