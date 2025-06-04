import jwt from "jsonwebtoken";
import supabase from "../db.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: "Access token required",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const { data: user, error } = await supabase
      .from("owners")
      .select("id, email, display_name, payman_paytag, created_at")
      .eq("id", decoded.ownerId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      error: "Invalid token",
    });
  }
};
