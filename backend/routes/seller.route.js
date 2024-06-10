import { sellerUpdate, getSellerData } from "../controllers/seller.controllers.js";
import express from "express";

const router = express.Router();
router.post("/update/:id", sellerUpdate);
router.post("/get/:id", getSellerData);

export default router;
