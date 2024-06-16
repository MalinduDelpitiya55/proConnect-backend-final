// Import necessary modules and models
import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

// Controller to create a review
export const createReview = async (req, res, next) => {
  // Prevent sellers from creating reviews
  if (req.isSeller) return next(createError(403, "Sellers can't create a review!"));

  // Create a new review instance
  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    // Check if the user has already created a review for the gig
    const existingReview = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (existingReview)
      return next(createError(403, "You have already created a review for this gig!"));

    // TODO: check if the user purchased the gig.

    // Save the new review
    const savedReview = await newReview.save();

    // Update the gig's total stars and number of reviews
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    // Send the saved review as the response
    res.status(201).send(savedReview);
  } catch (err) {
    // Pass the error to the error handler
    next(err);
  }
};

// Controller to get reviews for a gig
export const getReviews = async (req, res, next) => {
  try {
    // Find reviews for the specified gig ID
    const reviews = await Review.find({ gigId: req.params.gigId });
    // Send the reviews as the response
    res.status(200).send(reviews);
  } catch (err) {
    // Pass the error to the error handler
    next(err);
  }
};

// Controller to delete a review (implementation needed)
export const deleteReview = async (req, res, next) => {
  try {
    // Implementation needed for deleting a review
  } catch (err) {
    // Pass the error to the error handler
    next(err);
  }
};
