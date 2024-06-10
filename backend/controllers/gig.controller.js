import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res, next) => {
  
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));
  console.log("req.body.cat => "+req.body.cat);
  if (!req.body.cat)
    return next(createError(400, "Category (cat) is required"));

  console.log(res + " " + req.userId)
  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });
  
  try {  
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
    
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
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
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    next(err);
  }
};

export const updateGig = async (req, res, next) => {
  try {
    // Find the gig by ID
    const gig = await Gig.findById(req.params.id);
    
    // If gig not found, throw a 404 error
    if (!gig) return next(createError(404, "Gig not found!"));

    console.log(gig.userId);
    console.log(req.body.userID);

    // Check if the gig belongs to the current user
    if (gig.userId !== req.body.userID)
      return next(createError(403, "You can update only your gig!"));

    // Update the gig with new data
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title: req.body.gig.title },
      { new: true } // Return the updated document
    );
    console.log(updatedGig);
    // Send the updated gig as a response
    res.status(200).json(updatedGig);
  } catch (err) {
    // Log the error and pass it to the error handler
    console.error(err);
    next(err);
  }
};