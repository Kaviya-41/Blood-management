// backend/server.js — Entry point for Render (web service) and local dev
import { connectDB } from "./app.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to DB first, then start listening
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT} 🚀`)
  );
});
