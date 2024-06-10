import User from './../../models/user.model.js';
import mongoose from 'mongoose';

const sellersDetails = async (req, res) => {
    try {
        const seller = await User.find({ isSeller: true });
        const sellerDetails = seller.map(seller => ({
            sellerid: seller._id.toString(),
            name: seller.username,
            email: seller.email,
            img: seller.img || null,
            title: seller.title,
        }));

        res.json(sellerDetails);
    } catch (error) {
        console.error("Error fetching seller details:", error);
        res.status(500).json({ message: "Failed to fetch seller details" });
    }
};

const admindeletesellersDetails = async (req, res, next) => {
    try {
        const sellerID = req.params.id;

        // Validate buyerID
        if (!mongoose.Types.ObjectId.isValid(sellerID)) {
            return res.status(400).json({ message: 'Invalid seller ID' });
        }

        // Find the buyer by ID
        const seller = await User.findById(sellerID);

        // Check if the buyer exists
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Delete the buyer
        await User.findByIdAndDelete(sellerID);
        res.status(200).json({ message: 'Seller has been deleted' });
    } catch (err) {
        console.error("Error deleting seller:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { sellersDetails, admindeletesellersDetails };
