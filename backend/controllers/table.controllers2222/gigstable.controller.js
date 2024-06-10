import express from "express";
import Gig from "./../../models/gig.model.js";
import User from "./../../models/user.model.js";

const app = express();

const getGigDetails = async (req, res) => {
    try {
        const gigs = await Gig.find();

        const gigDetails = await Promise.all(gigs.map(async gig => {
            if (gig) {
                try {
                    // Fetch user details separately
                    const user = await User.findById(gig.userId, 'username email img');
                    if (user) {
                        return {
                            id: gig._id,
                            title: gig.title,
                            cover: gig.cover,
                            userID: {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                img: user.img || 'defaultImagePath.jpg' // Use a default image path if img is null
                            }
                        };
                    } else {
                        console.warn(`User not found for gig ${gig._id}`);
                        return null;
                    }
                } catch (userError) {
                    console.error(`Error fetching user details for gig ${gig._id}:`, userError);
                    return null;
                }
            }
        }));

        const validGigDetails = gigDetails.filter(detail => detail !== null);
        res.json(validGigDetails);
    } catch (error) {
        console.error("Error fetching gig details:", error);
        res.status(500).json({ message: "Failed to fetch gig details" });
    }
};

const admindeleteGig = async (req, res, next) => {
    try {
        const gigId = req.params.id;
        console.log(`Deleting gig with ID: ${gigId}`);

        // Check if gig exists
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        // If gig exists, delete it
        await Gig.findByIdAndDelete(gigId);
        res.status(200).json({ message: 'Gig has been deleted' });
    } catch (err) {
        console.error(`Error deleting gig with ID: ${req.params.id}`, err);
        next(err);
    }
};

export { getGigDetails, admindeleteGig };
