const express = require("express");
const app = express();
const { config } = require("./config/env");
const { connectDB } = require("./config/db");

const { PORT = 3001 } = process.env;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
