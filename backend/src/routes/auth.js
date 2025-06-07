import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db.js";
import { authenticateToken } from "../middleware/auth.js";
import { PaymanClient } from "@paymanai/payman-ts";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Get current user (protected route)
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, displayName, paymanPaytag } = req.body;

    // Validate input
    if (!email || !password || !displayName || !paymanPaytag) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("owners")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabase
      .from("owners")
      .insert({
        email,
        password_hash: passwordHash,
        display_name: displayName,
        payman_paytag: paymanPaytag,
      })
      .select()
      .single();

    if (error) throw error;

    // Generate JWT
    const token = jwt.sign({ ownerId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Signup failed",
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from("owners")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign({ ownerId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
    });
  }
});

// Payman OAuth token exchange
router.post("/payman/exchange", async (req, res) => {
  try {
    const { code } = req.body;
    console.log("Received code:", code);
    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Authorization code required",
      });
    }

    const client = PaymanClient.withAuthCode(
      {
        clientId: process.env.PAYMAN_CLIENT_ID,
        clientSecret: process.env.PAYMAN_CLIENT_SECRET,
      },
      code
    );
    // Wait for client initialization
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const tokenResponse = await client.getAccessToken();
    console.log("Token response:", tokenResponse);
    if (!tokenResponse?.accessToken) {
      return res.status(500).json({
        success: false,
        error: "Invalid token response from Payman",
      });
    }

    res.json({
      success: true,
      accessToken: tokenResponse.accessToken,
      expiresIn: tokenResponse.expiresIn,
    });
  } catch (error) {
    console.error("Payman token exchange failed:", error);
    res.status(500).json({
      success: false,
      error: "Token exchange failed",
    });
  }
});

export default router;
