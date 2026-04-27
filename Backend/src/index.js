import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import alertRoutes from "./routes/alertRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());

// Attach io to every request so controllers can access it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hey, Im running",
  });
});

// Routes
app.use("/api/alerts", alertRoutes);
app.use("/api/chat", chatRoutes);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();