import mongoose from 'mongoose';
import Seller from './../models/seller.model.js'; // Adjust the path as per your project structure

// Endpoint to handle creating or updating seller data
export const sellerUpdate = async (req, res) => {
    try {
        const userId = req.body.id; // Assuming userId is sent from the frontend
        const sellerData = req.body.data; // Assuming sellerData is sent from the frontend

        // Ensure each education entry has a valid ObjectId for _id
        sellerData.education = sellerData.education.map(entry => {
            if (!entry._id || !mongoose.Types.ObjectId.isValid(entry._id)) {
                entry._id = new mongoose.Types.ObjectId();
            }
            return entry;
        });

        // Find existing seller data for the user
        let existingSeller = await Seller.findOne({ user: userId });

        if (existingSeller) {
            // Update existing seller data
            existingSeller.title = sellerData.title;
            existingSeller.skills = sellerData.skills;
            existingSeller.qualifications = sellerData.qualifications;
            existingSeller.education = sellerData.education;

            // Save updated seller data
            existingSeller = await existingSeller.save();
            res.status(200).json({ message: 'Seller data updated successfully', seller: existingSeller });
        } else {
            // Create a new seller instance
            const newSeller = new Seller({
                user: userId, // Associate the seller with the user
                ...sellerData, // Spread the seller's data
            });

            // Save the new seller data
            const savedSeller = await newSeller.save();
            res.status(201).json({ message: 'Seller data created successfully', seller: savedSeller });
        }
    } catch (error) {
        console.error('Error saving/updating seller data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSellerData = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming userId is sent from the frontend as a parameter
        const existingSeller = await Seller.findOne({ user: userId });

        if (existingSeller) {
            res.status(200).json(existingSeller); // Send the seller data in the response
        } else {
            const nullSellerData = {
                title: '',
                skills: ['', '', ''],
                qualifications: ['', ''],
                education: [
                    {
                        institution: '',
                        degree: '',
                        _id: new mongoose.Types.ObjectId()
                    },
                    {
                        institution: '',
                        degree: '',
                        _id: new mongoose.Types.ObjectId()
                    }
                ]
            };
            res.status(200).json(nullSellerData);
        }
    } catch (error) {
        console.error('Error fetching seller data:', error);
        const nullSellerData = {
            title: '',
            skills: ['', '', ''],
            qualifications: ['', ''],
            education: [
                {
                    institution: '',
                    degree: '',
                    _id: new mongoose.Types.ObjectId()
                },
                {
                    institution: '',
                    degree: '',
                    _id: new mongoose.Types.ObjectId()
                }
            ]
        };
        res.status(200).json(nullSellerData);
    }
}
