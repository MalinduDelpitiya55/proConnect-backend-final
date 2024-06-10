import User from './../models/user.model.js' 
import Order from './../models/order.model.js' 
import Gig from './../models/gig.model.js' 

const getUsersCountByType = async (req, res) => {
    try {
        const sellerCount = await User.countDocuments({ isSeller: true });
        const buyerCount = await User.countDocuments({ isSeller: false });
        res.status(200).json({ sellers: sellerCount, buyers: buyerCount });
    } catch (error) {
        console.error('Error fetching users count by type:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
 const getTotalCompletedOrderPrices = async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $match: { isCompleted: true } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const total = result.length > 0 ? result[0].total : 0;
        res.status(200).json({ total });
    } catch (error) {
        console.error('Error fetching total completed order prices:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getTotalGigCount = async (req, res) => {
    try {
        const totalGigs = await Gig.countDocuments();
        res.status(200).json({ total: totalGigs });
    } catch (error) {
        console.error('Error fetching total gig count:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
};
export { getUsersCountByType, getTotalCompletedOrderPrices, getTotalGigCount }