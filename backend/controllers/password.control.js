// Import necessary modules
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Configure the email transporter using Gmail and environment variables for security
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
  },
});

// Function to generate a JWT token for password reset
const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
};

// Controller to handle password reset request
const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email presence
    if (!email) {
      return res.status(400).json({ status: 'error', error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'Email not found' });
    }

    // Generate reset token and link
    const token = generateResetToken(email);
    const resetLink = `http://localhost:5173/api/password/ResetPassword?token=${token}`;

    // Email options for the reset link
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>Please click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    };

    // Send the reset email
    await transporter.sendMail(mailOptions);
    res.json({ status: 'success', message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ status: 'error', error: 'Failed to send password reset email' });
  }
};

// Controller to handle password reset
const ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validate token and new password presence
    if (!token || !newPassword) {
      return res.status(400).json({ status: 'error', error: 'Token and new password are required' });
    }

    // Verify the token and decode the email
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const email = decoded.email;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    // Hash the new password and save it to the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: 'success', message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ status: 'error', error: 'Failed to reset password' });
  }
};

// Export the controller functions
export { ResetPassword, ForgetPassword };
