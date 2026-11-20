
const express = require("express");
const { supabaseAuth } = require("../config/supabaseAuth");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, full_name: fullName } = req.body || {};

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      typeof fullName !== "string" ||
      !fullName.trim() ||
      fullName.length > 100
    ) {
      return res.status(400).json({
        error: "Valid email, password (8+ characters), and full name are required"
      });
    }

    const { data, error } = await supabaseAuth.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim()
        }
      }
    });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(201).json({
      message: "Registration request processed",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email
          }
        : null,
      emailConfirmationRequired: !data.session
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const { data, error } =
      await supabaseAuth.auth.signInWithPassword({
        email: email.trim(),
        password
      });

    if (error) {
      return res.status(401).json({
        error: "Invalid credentials or unconfirmed email"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
