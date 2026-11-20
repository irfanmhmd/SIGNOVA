const express = require("express");

const router = express.Router();

// POST /risk/explain
router.post("/explain", async (req, res, next) => {
  try {
    const { explainFinding } = await import(
      "../../../explanation/src/index.js"
    );

    const result = explainFinding(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
