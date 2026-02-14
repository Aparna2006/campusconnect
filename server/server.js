const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { initSocket } = require("./socket");
const supportRoutes = require("./routes/supportRoutes");
dotenv.config();
const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests. Try again later." },
  })
);
app.use(express.json());
app.use("/api/support", supportRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/opportunities", require("./routes/opportunityRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/clubs", require("./routes/clubRoutes"));
app.use("/api/realtime", require("./routes/realtimeRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("CampusConnect Backend is Running");
});

// Server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    initSocket(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
