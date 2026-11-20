
const { supabase } = require("../src/config/supabase");

async function testConnection() {
  console.log("Testing SIGNOVA Supabase connection...");

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase response:", error.message);
      process.exitCode = 1;
      return;
    }

    console.log("Supabase query successful!");
    console.log("Records returned:", data.length);
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exitCode = 1;
  }
}

testConnection();
