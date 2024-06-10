import express from "express";
import Gig from "./../../models/gig.model.js";
import User from "./../../models/user.model.js";
import Order from "./../../models/order.model.js";
import mongoose from 'mongoose';
const app = express();

const getPaymentDetails = async (req, res) => {
    try {
        // Fetch only completed orders
        const orders = await Order.find({ isCompleted: true });

        const orderDetails = await Promise.all(orders.map(async order => {
            try {
                // Fetch related data
                const gig = await Gig.findById(order.gigId, 'title cover price');
                const seller = await User.findById(order.sellerId, 'username email img');
                const buyer = await User.findById(order.buyerId, 'username email img');
                
                // Check if related data exists
                if (!gig || !seller || !buyer) {
                    return null; // Skip this order
                }

                return {
                    id: order._id,
                    gig: {
                        title: gig.title,
                        cover: gig.cover,
                        price: gig.price
                    },
                    seller: {
                        id: seller._id,
                        username: seller.username,
                        email: seller.email,
                        img: seller.img
                    },
                    buyer: {
                        id: buyer._id,
                        username: buyer.username,
                        email: buyer.email,
                        img: buyer.img
                    }
                };
            } catch (err) {
                console.error(`Failed to fetch related data for order ${order._id}`, err);
                return null;
            }
            
        })); 

        // Filter out null values from orderDetails
        const validOrderDetails = orderDetails.filter(detail => detail !== null);
        res.json(validOrderDetails);
    } catch (error) {
        console.error("Failed to fetch order details", error);
        res.status(500).json({ message: "Failed to fetch order details" });
    }
}

const admindeletepaymentDetails = async (req, res, next) => {
    try {
        const paymentID = req.params.id;
        
        // Validate buyerID
        if (!mongoose.Types.ObjectId.isValid(paymentID)) {
            return res.status(400).json({ message: 'Invalid payment ID' });
        }

        // Find the buyer by ID
        const ordes = await Order.findById(paymentID);
        console.log(ordes);
        // Check if the buyer exists
        if (!ordes) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Delete the buyer
        await Order.findByIdAndDelete(paymentID);
        res.status(200).json({ message: 'Seller has been deleted' });
    } catch (err) {
        console.error("Error deleting seller:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};




export { getPaymentDetails, admindeletepaymentDetails };
