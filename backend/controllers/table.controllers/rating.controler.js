import express from "express";
import Gig from "./../../models/gig.model.js";
import User from "./../../models/user.model.js";
import Rating from "./../../models/review.model.js";

const app = express();

const getratingDetails = async (req, res) => {
    try {
        const ratings = await Rating.find();

        const ratingDetails = await Promise.all(ratings.map(async rating => {
            if (rating) {
                try {
                    // Fetch user and gig details separately
                    const buyer = await User.findById(rating.userId, 'username email img');
                    const gig = await Gig.findById(rating.gigId, 'title cover'); // Corrected model used here
                    if (buyer && gig) {
                        return {
                            id: rating.id,
                            review: rating.desc,
                            cover: gig.cover,
                            userID: {
                                id: buyer._id,
                                username: buyer.username,
                                email: buyer.email,
                                img: buyer.img || 'defaultImagePath.jpg' // Use a default image path if img is null
                            },
                            gigTitle: gig.title
                        };
                    } else {
                        console.warn(`User or Gig not found for rating ${rating.id}`);
                        return null;
                    }
                } catch (userError) {
                    console.error(`Error fetching user or gig details:`, userError);
                    return null;
                }
            }
        }));

        const validRatingDetails = ratingDetails.filter(detail => detail !== null);
        res.json(validRatingDetails);
    } catch (error) {
        console.error("Error fetching rating details:", error);
        res.status(500).json({ message: "Failed to fetch rating details" });
    }
};

const adminratingGig = async (req, res, next) => {
    try {
        const orderid = req.params.id;

        // Check if gig exists
        const order = await Rating.findById(orderid);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If gig exists, delete it
        await Rating.findByIdAndDelete(orderid);
        res.status(200).json({ orderid: 'Order has been deleted' });
    } catch (err) {
        console.error(`Error deleting order with ID: ${req.params.id}`, err);
        next(err);
    }
};

const adminratingedit = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const updatedReview = req.body.review;

        // Check if the review exists
        const review = await Rating.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update the review with the new content
        review.desc = updatedReview;
        await review.save();

        // Return success response
        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error(`Error updating review with ID: ${req.params.id}`, error);
        res.status(500).json({ message: 'Failed to update review' });
    }
};


export { getratingDetails, adminratingGig, adminratingedit };
