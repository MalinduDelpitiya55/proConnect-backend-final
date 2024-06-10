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

import Gig from "../models/gig.model.js";
dotenv.config();
mongoose.set("strictQuery", true);

const app = express();

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

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Health check route
app.get('/health', (req, res, next) => {
  try {
    const sellerCount =  User.countDocuments({ isSeller: true });
    const buyerCount =  User.countDocuments({ isSeller: false });
    res.status(200).json({ sellers: sellerCount, buyers: buyerCount });
  } catch (error) {
    console.error('Error fetching users count by type:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

const port = process.env.PORT || 8800;

app.listen(port, () => {
  connect();
  console.log(`Backend server is running on port ${port}!`);
});
