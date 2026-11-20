
const express = require("express");
const { randomUUID } = require("node:crypto");

const requireAuth = require("../middleware/requireAuth");

const {
  createUserSupabase
} = require("../config/supabaseUser");

const router = express.Router();

// All transaction intent routes require authentication
router.use(requireAuth);

// POST /intent
// Create a new pending blockchain transaction intent
router.post("/", async (req, res, next) => {
  try {
    const { chain_id, recipient, amount } = req.body || {};

    // Validate required fields
    if (
      typeof chain_id !== "string" ||
      typeof recipient !== "string" ||
      typeof amount !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "chain_id, recipient and amount must be strings"
      });
    }

    const chainId = chain_id.trim();
    const recipientAddress = recipient.trim();
    const transferAmount = amount.trim();

    // Validate basic transaction format
    if (
      !/^[a-zA-Z0-9_-]{1,64}$/.test(chainId) ||
      !/^0x[a-fA-F0-9]{40}$/.test(recipientAddress) ||
      !/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(transferAmount) ||
      !/[1-9]/.test(transferAmount)
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid transaction details"
      });
    }

    // Use the authenticated user's Supabase token
    const supabase = createUserSupabase(req.accessToken);

    // Save the transaction intent
    const { data, error } = await supabase
      .from("transaction_intents")
      .insert({
        id: randomUUID(),
        user_id: req.user.id,
        chain_id: chainId,
        recipient: recipientAddress,
        amount: transferAmount,
        status: "PENDING"
      })
      .select(
        "id, user_id, chain_id, recipient, amount, status, created_at"
      )
      .single();

    // Handle Supabase errors
    if (error) {
      console.error("Transaction intent insert failed:", {
        code: error.code,
        message: error.message
      });

      return res.status(500).json({
        success: false,
        error: "Unable to create transaction intent"
      });
    }

    // Return the created transaction
    return res.status(201).json({
      success: true,
      intent: data
    });

  } catch (error) {
    next(error);
  }
});

 // GET /intent
 // Retrieve the authenticated user's transaction history
router.get("/", async (req, res, next) => {
  try {
    const supabase = createUserSupabase(req.accessToken);

    const { data, error } = await supabase
      .from("transaction_intents")
      .select(
        "id, chain_id, recipient, amount, status, created_at"
      )
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Transaction history fetch failed:", {
        code: error.code,
        message: error.message
      });

      return res.status(500).json({
        success: false,
        error: "Unable to retrieve transaction history"
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      transactions: data
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
