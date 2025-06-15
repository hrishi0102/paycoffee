import express from "express";
import supabase from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all widgets for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { data: widgets, error } = await supabase
      .from("widgets")
      .select("*")
      .eq("owner_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      widgets,
    });
  } catch (error) {
    console.error("Get widgets error:", error);
    res.status(500).json({
      error: "Failed to fetch widgets",
    });
  }
});

// Create new widget
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      defaultAmounts,
      allowCustomAmount,
      buttonText,
      primaryColor,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    const { data: widget, error } = await supabase
      .from("widgets")
      .insert({
        owner_id: req.user.id,
        title,
        description: description || "",
        default_amounts: defaultAmounts || [5, 10, 25],
        allow_custom_amount: allowCustomAmount !== false,
        button_text: buttonText || "Buy me a coffee",
        primary_color: primaryColor || "#4fd1c7",
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      widget,
    });
  } catch (error) {
    console.error("Create widget error:", error);
    res.status(500).json({
      error: "Failed to create widget",
    });
  }
});

// Get widget by ID (for authenticated user)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { data: widget, error } = await supabase
      .from("widgets")
      .select("*")
      .eq("id", req.params.id)
      .eq("owner_id", req.user.id)
      .single();

    if (error || !widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    res.json({
      success: true,
      widget,
    });
  } catch (error) {
    console.error("Get widget error:", error);
    res.status(500).json({
      error: "Failed to fetch widget",
    });
  }
});

// Update widget
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      defaultAmounts,
      allowCustomAmount,
      buttonText,
      primaryColor,
    } = req.body;

    const { data: widget, error } = await supabase
      .from("widgets")
      .update({
        title,
        description,
        default_amounts: defaultAmounts,
        allow_custom_amount: allowCustomAmount,
        button_text: buttonText,
        primary_color: primaryColor,
      })
      .eq("id", req.params.id)
      .eq("owner_id", req.user.id)
      .select()
      .single();

    if (error || !widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    res.json({
      success: true,
      widget,
    });
  } catch (error) {
    console.error("Update widget error:", error);
    res.status(500).json({
      error: "Failed to update widget",
    });
  }
});

// Delete widget
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from("widgets")
      .delete()
      .eq("id", req.params.id)
      .eq("owner_id", req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Widget deleted successfully",
    });
  } catch (error) {
    console.error("Delete widget error:", error);
    res.status(500).json({
      error: "Failed to delete widget",
    });
  }
});

// Get widget public info (for payment page - no auth required)
router.get("/:id/public", async (req, res) => {
  try {
    const { data: widget, error } = await supabase
      .from("widgets")
      .select(
        `
        *,
        owners!inner(display_name, payman_paytag)
      `
      )
      .eq("id", req.params.id)
      .single();

    if (error || !widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    res.json({
      success: true,
      widget: {
        id: widget.id,
        title: widget.title,
        description: widget.description,
        default_amounts: widget.default_amounts,
        allow_custom_amount: widget.allow_custom_amount,
        button_text: widget.button_text,
        primary_color: widget.primary_color,
        owner: {
          display_name: widget.owners.display_name,
          payman_paytag: widget.owners.payman_paytag,
        },
      },
    });
  } catch (error) {
    console.error("Get public widget error:", error);
    res.status(500).json({
      error: "Failed to fetch widget",
    });
  }
});

// Generate embed code
router.get("/:id/embed", authenticateToken, async (req, res) => {
  try {
    const { data: widget, error } = await supabase
      .from("widgets")
      .select("*")
      .eq("id", req.params.id)
      .eq("owner_id", req.user.id)
      .single();

    if (error || !widget) {
      return res.status(404).json({
        error: "Widget not found",
      });
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://paycoffee-api.vercel.app" // Update this with your actual API URL
        : "http://localhost:3001";

    // Simple one-line embed code like Chatbase
    const embedCode = `<script src="${baseUrl}/api/embed/widget.js?id=${widget.id}" defer></script>`;

    res.json({
      success: true,
      embedCode,
    });
  } catch (error) {
    console.error("Generate embed error:", error);
    res.status(500).json({
      error: "Failed to generate embed code",
    });
  }
});

export default router;
