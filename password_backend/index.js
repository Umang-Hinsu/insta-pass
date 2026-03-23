require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const passwordRoutes = require("./src/password.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/password", passwordRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/insta_password_db";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
