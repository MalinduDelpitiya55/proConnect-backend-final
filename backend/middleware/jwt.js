import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  // Retrieve the token from cookies
  const token = req.cookies.accessToken;

  // If no token is found, respond with a 401 error
  if (!token) return next(createError(401, "You are not authenticated!"));

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    // If token verification fails, respond with a 403 error
    if (err) return next(createError(403, "Token is not valid!"));

    // Attach user information from the token payload to the request object
    req.userId = payload.id;
    req.isSeller = payload.isSeller;

    // Continue to the next middleware or route handler
    next();
  });
};
