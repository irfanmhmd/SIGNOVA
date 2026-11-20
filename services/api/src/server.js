
const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log("=================================");
  console.log("SIGNOVA Backend Started");
  console.log(`Server: http://localhost:${port}`);
  console.log(`Health: http://localhost:${port}/health`);
  console.log("=================================");
});
