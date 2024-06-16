import User from "../models/user.model.js";
import Seller from "../models/seller.model.js"; // Remove if not used
import createError from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account!"));
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User deleted successfully.");
  } catch (err) {
    console.error('Error deleting user:', err);
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).send(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    next(err);
  }
};
