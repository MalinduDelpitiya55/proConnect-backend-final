import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD
  }
});

const ForgetPassword = async (req, res) => {
  
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ status: 'error', error: 'Email is required' });
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'Email not found' });
    }
  
    const token = generateResetToken(email);
    const resetLink = `http://localhost:5173/api/password/ResetPassword?token=${token}`;
  
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>Please click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
    };
  
    await transporter.sendMail(mailOptions);
    res.json({ status: 'success', message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ status: 'error', error: 'Failed to send password reset email' });
  }
};

const ResetPassword = async (req, res) => {
    console.log("run");
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ status: 'error', error: 'Token and new password are required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: 'success', message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ status: 'error', error: 'Failed to reset password' });
  }
};

const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
};

export { ResetPassword, ForgetPassword };
