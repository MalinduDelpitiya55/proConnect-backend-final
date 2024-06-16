// Import necessary modules
import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Create a new message
export const createMessage = async (req, res, next) => {
  // Create a new Message instance with the provided data
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });

  try {
    // Save the new message to the database
    const savedMessage = await newMessage.save();

    // Update the corresponding conversation with the new message details
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true } // Return the updated document
    );

    // Send the saved message as a response
    res.status(201).send(savedMessage);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
};

// Get all messages for a specific conversation
export const getMessages = async (req, res, next) => {
  try {
    // Find all messages with the given conversation ID
    const messages = await Message.find({ conversationId: req.params.id });

    // Send the messages as a response
    res.status(200).send(messages);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
};
