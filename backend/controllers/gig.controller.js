// Import necessary modules
import Gig from "../models/gig.model.js"; // Import the Gig model
import createError from "../utils/createError.js"; // Import custom error creation utility

// Create a new gig
export const createGig = async (req, res, next) => {
  // Check if the user is a seller
  if (!req.isSeller) {
    return next(createError(403, "Only sellers can create a gig!"));
  }

  // Check if the category (cat) is provided
  if (!req.body.cat) {
    return next(createError(400, "Category (cat) is required"));
  }

  // Create a new Gig instance with userId and request body data
  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    // Save the new gig to the database
    const savedGig = await newGig.save();
    // Send the saved gig as a response
    res.status(201).json(savedGig);
  } catch (err) {
    // Log the error and pass it to the error handler
    console.log(err);
    next(err);
  }
};

// Delete a gig
export const deleteGig = async (req, res, next) => {
  try {
    // Find the gig by ID
    const gig = await Gig.findById(req.params.id);
    // Check if the gig belongs to the current user
    if (gig.userId !== req.userId) {
      return next(createError(403, "You can delete only your gig!"));
    }

    // Delete the gig by ID
    await Gig.findByIdAndDelete(req.params.id);
    // Send a success message
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
};

// Get a single gig by ID
export const getGig = async (req, res, next) => {
  try {
    // Find the gig by ID
    const gig = await Gig.findById(req.params.id);
    // If gig not found, return a 404 error
    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }
    // Send the gig as a response
    res.status(200).send(gig);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
};

// Get multiple gigs based on query filters
export const getGigs = async (req, res, next) => {
  const q = req.query;

  // Create filters based on query parameters
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };

  try {
    // Find gigs based on filters and sort them
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    console.log(gigs.title);
    // Send the gigs as a response
    res.status(200).send(gigs);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
};

// Update a gig by ID
export const updateGig = async (req, res, next) => {
  try {
    // Find the gig by ID
    const gig = await Gig.findById(req.params.id);

    // If gig not found, return a 404 error
    if (!gig) {
      return next(createError(404, "Gig not found!"));
    }

    // Check if the gig belongs to the current user
    if (gig.userId !== req.userId) {
      return next(createError(403, "You can update only your gig!"));
    }

    // Update the gig with new data
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true } // Return the updated document
    );

    // Send the updated gig as a response
    res.status(200).json(updatedGig);
  } catch (err) {
    // Log the error and pass it to the error handler
    console.error(err);
    next(err);
  }
};
