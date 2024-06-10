import express from "express";
import Gig from "./../../models/gig.model.js";
import User from "./../../models/user.model.js";
import Order from "./../../models/order.model.js";

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
                    id: order.id,
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

        })); console.log(orderDetails.gig);

        // Filter out null values from orderDetails
        const validOrderDetails = orderDetails.filter(detail => detail !== null);
        res.json(validOrderDetails);
    } catch (error) {
        console.error("Failed to fetch order details", error);
        res.status(500).json({ message: "Failed to fetch order details" });
    }
}

export { getPaymentDetails };
