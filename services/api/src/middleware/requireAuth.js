
const { supabaseAuth } = require("../config/supabaseAuth");

// Middleware to protect authenticated routes
async function requireAuth(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required"
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Invalid authorization token"
      });
    }

    // Verify JWT through Supabase Auth
    const { data, error } =
      await supabaseAuth.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token"
      });
    }

    // Attach authenticated user to request
    req.user = {
      id: data.user.id,
      email: data.user.email
    };
    req.accessToken = token;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAuth;
