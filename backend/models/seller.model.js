import mongoose from "mongoose";
const { Schema } = mongoose;

const sellerSchema = new Schema({
  // Reference to the user who is a seller
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  skills: [String],
  qualifications: [String],
  education: [
    {
      institution: String,
      degree: String,
    },
  ],
});

export default mongoose.model("Seller", sellerSchema);