import User from './../../models/user.model.js';
import mongoose from 'mongoose';

const buyersDetails = async (req, res) => {
    try {
        const buyers = await User.find({ isSeller: false });
        const buyerDetails = buyers.map(buyer => ({
            buyerid: buyer._id.toString(),
            name: buyer.username,
            email: buyer.email,
            img: buyer.img || null,
        }));

        res.json(buyerDetails);
    } catch (error) {
        console.error("Error fetching buyer details:", error);
        res.status(500).json({ message: "Failed to fetch buyer details" });
    }
};

const admindeletebuyersDetails = async (req, res, next) => {
    
    try {
        const buyerID = req.params.id;

        // Validate buyerID
        if (!mongoose.Types.ObjectId.isValid(buyerID)) {
            return res.status(400).json({ message: 'Invalid buyer ID' });
        }

        // Find the buyer by ID
        const buyer = await User.findById(buyerID);

        // Check if the buyer exists
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Delete the buyer
        await User.findByIdAndDelete(buyerID);
        res.status(200).json({ message: 'Buyer has been deleted' });
    } catch (err) {
        console.error("Error deleting Buyer:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { buyersDetails, admindeletebuyersDetails };
