const express = require("express");
const app = express();
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";

const { PORT = 3001 } = process.env;

await connectDB;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
