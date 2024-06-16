// Import the necessary models for User, Order, and Gig
import User from './../models/user.model.js';
import Order from './../models/order.model.js';
import Gig from './../models/gig.model.js';

// Function to get the count of users by type (sellers and buyers)
const getUsersCountByType = async (req, res) => {
    try {
        // Run both count queries concurrently for better performance
        const [sellerCount, buyerCount] = await Promise.all([
            User.countDocuments({ isSeller: true }), // Count documents where isSeller is true
            User.countDocuments({ isSeller: false }) // Count documents where isSeller is false
        ]);

        // Respond with the counts of sellers and buyers in JSON format
        res.status(200).json({ sellers: sellerCount, buyers: buyerCount });
    } catch (error) {
        // Log the error to the console
        console.error('Error fetching users count by type:', error);
        // Respond with a 500 Internal Server Error and an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to get the total prices of all completed orders
const getTotalCompletedOrderPrices = async (req, res) => {
    try {
        // Use MongoDB aggregation to calculate the total prices of completed orders
        const result = await Order.aggregate([
            { $match: { isCompleted: true } }, // Match only completed orders
            { $group: { _id: null, total: { $sum: "$price" } } } // Group and sum the prices
        ]);

        // If there are results, set total to the sum; otherwise, set it to 0
        const total = result.length > 0 ? result[0].total : 0;

        // Respond with the total completed order prices in JSON format
        res.status(200).json({ total });
    } catch (error) {
        // Log the error to the console
        console.error('Error fetching total completed order prices:', error);
        // Respond with a 500 Internal Server Error and an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to get the total count of gigs
const getTotalGigCount = async (req, res) => {
    try {
        // Count the total number of gig documents
        const totalGigs = await Gig.countDocuments();

        // Respond with the total number of gigs in JSON format
        res.status(200).json({ total: totalGigs });
    } catch (error) {
        // Log the error to the console
        console.error('Error fetching total gig count:', error);
        // Respond with a 500 Internal Server Error and an error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export the functions to make them available for import in other parts of the application
export { getUsersCountByType, getTotalCompletedOrderPrices, getTotalGigCount };
