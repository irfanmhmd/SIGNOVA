
const { createClient } = require("@supabase/supabase-js");

function createUserSupabase(accessToken) {
  if (!accessToken || typeof accessToken !== "string") {
    throw new Error("Authenticated access token required");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase configuration missing");
  }

  return createClient(supabaseUrl, publishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

module.exports = { createUserSupabase };
