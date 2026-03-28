const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const passwordRoutes = require("./src/password.route");

const app = express();

app.use(cors());
app.use(express.json());

const rawUri = process.env.MONGODB_URI || "";
const MONGODB_URI = rawUri.replace(/^["']|["']$/g, '').trim();

if (!MONGODB_URI) {
  console.error("Fatal Error: MONGODB_URI is not defined.");
  process.exit(1);
}

// Global caching for Mongoose in Serverless environments (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      message: "Internal server error: DB disconnected",
      details: error.message,
    });
  }
});

app.use("/api/password", passwordRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
