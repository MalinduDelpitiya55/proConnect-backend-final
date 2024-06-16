// Import necessary modules
import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

// Stripe payment intent creation
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  try {
    // Find the gig by ID
    const gig = await Gig.findById(req.params.id);

    // Create a payment intent with the gig price
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100, // Stripe expects the amount in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Create a new order with the gig and payment details
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      requirements: req.body.additionalInfo,
    });

    // Save the new order to the database
    await newOrder.save();

    // Send the client secret for the payment intent to the client
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

// Get orders for the current user
export const getOrders = async (req, res, next) => {
  try {
    // Find orders based on whether the user is a seller or buyer
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    // Send the orders as a response
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

// Confirm an order based on the payment intent
export const confirm = async (req, res, next) => {
  try {
    // Find and update the order by payment intent ID
    const order = await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      { $set: { isCompleted: true } },
      { new: true }
    );
console.log(order);
    // If order not found, return a 404 error
    if (!order) return next(createError(404, "Order not found"));

    // Send a confirmation message
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// Update an order's requirements
export const updateOrder = async (req, res, next) => {
  try {
    const { orderId, requirements } = req.body;

    // Find and update the order by ID
    const order = await Order.findByIdAndUpdate(orderId, { requirements }, { new: true });

    // If order not found, return a 404 error
    if (!order) return next(createError(404, "Order not found"));

    // Send the updated order as a response
    res.status(200).send(order);
  } catch (err) {
    next(err);
  }
};
