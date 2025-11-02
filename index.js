import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import eventRoutes from "./routes/event.js";
import bookingRoutes from "./routes/booking.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "TripNest API",
    version: "1.0.0",
    documentation: "/api-docs.html",
    endpoints: {
      auth: "/auth",
      users: "/user",
      events: "/event",
      bookings: "/booking",
    },
  });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
