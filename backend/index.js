import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import admin from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import password from "./routes/password.js";
import sellerRoutes from "./routes/seller.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import User from './models/user.model.js'
const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const router = express.Router();
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/admin", admin);
app.use("/api/seller", sellerRoutes);
app.use("/api/password", password);
app.get("/", (req, res) => {
  res.send("Welcome!");
  console.log("Server is runing...");
});
app.get("/ping", async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    await admin.ping();
    res.status(200).json({ message: "MongoDB is reachable" });
  } catch (error) {
    console.error("Error pinging MongoDB:", error);
    res.status(500).json({ message: "Error pinging MongoDB" });
  }
});
app.get("/abc", async (req, res) => {
  console.log("1");
  try {
    console.log("2");
    const a = 2;
    const sellerCount = await User.countDocuments({ isSeller: true });
    console.log("3");
    const buyerCount = await User.countDocuments({ isSeller: false });
    console.log("4");
    res.status(200).json({ sellers: sellerCount, buyers: buyerCount , buyerCount: buyerCount});
  } catch (error) {
    console.error('Error fetching users count by type:', error);
    console.log("error");
    res.status(500).json({ message: 'Internal Server Error' });
  }
  console.log("Server is runing...");
});
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});
