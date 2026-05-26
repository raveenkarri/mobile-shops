import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { setupSocket } from "./sockets/socketHandler.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL_OWNER, process.env.CLIENT_URL_USER],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL_OWNER, process.env.CLIENT_URL_USER],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Socket.io
setupSocket(io);

// Error handler
app.use(errorHandler);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
