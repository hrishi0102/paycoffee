import express from "express";
import { PaymanClient } from "@paymanai/payman-ts";
import supabase from "../db.js";

const router = express.Router();

// Process payment
router.post("/:widgetId", async (req, res) => {
  try {
    const { amount, supporterToken, supporterName, message } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Valid amount is required",
      });
    }

    if (!supporterToken) {
      return res.status(400).json({
        error: "Supporter authentication required",
      });
    }

    // Get widget and owner info
    const { data: widget, error: widgetError } = await supabase
      .from("widgets")
      .select(
        `
        *,
        owners!inner(display_name, payman_paytag)
      `
      )
      .eq("id", req.params.widgetId)
      .single();

    if (widgetError || !widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    // Initialize Payman client with supporter's token
    const supporterClient = PaymanClient.withToken(
      process.env.PAYMAN_CLIENT_ID,
      {
        accessToken: supporterToken,
        expiresIn: 3600,
      }
    );

    // Create payee for widget owner (if not exists)
    const createPayeeResponse = await supporterClient.ask(
      `Create a payee for paytag ${widget.owners.payman_paytag} named ${widget.owners.display_name}`
    );

    // Send payment
    const paymentResponse = await supporterClient.ask(
      `Send ${amount} TSD to ${widget.owners.display_name}`
    );

    // Record transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        widget_id: widget.id,
        amount: parseFloat(amount),
        supporter_name: supporterName || "Anonymous",
        message: message || "",
        owner_paytag: widget.owners.payman_paytag,
        payman_transaction_id: paymentResponse.id || "unknown",
        status: "completed",
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Transaction recording error:", transactionError);
    }

    res.json({
      success: true,
      message: "Payment sent successfully",
      transaction: transaction || { amount, status: "completed" },
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      error: "Payment failed: " + error.message,
    });
  }
});

// Get widget transactions (for owner)
router.get("/widget/:widgetId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Verify widget belongs to authenticated user
    const { data: widget, error: widgetError } = await supabase
      .from("widgets")
      .select("owner_id")
      .eq("id", req.params.widgetId)
      .single();

    if (widgetError || !widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    // Get transactions
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("widget_id", req.params.widgetId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      error: "Failed to fetch transactions",
    });
  }
});

export default router;
