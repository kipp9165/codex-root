import dotenv from "dotenv";
dotenv.config();

import app from "./server.js";

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`Codex Root v1 listening on port ${port}`);
});
