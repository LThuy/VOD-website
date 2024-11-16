const User = require('../../models/Account')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Create a transporter using your email service provider's SMTP server
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change it to your email provider
    auth: {
        user: process.env.EMAIL_USER, // Email address
        pass: process.env.EMAIL_APP_PASSWORD, // App password or email password
    },
});

// Send a verification email
const sendVerificationEmail = (email, token) => {
    const verificationUrl = `http://localhost:5000/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

class SiteControllers {
    //GET login section : /checkLogin
    async checkLogin(req, res) {
        const {
            email,
            password
        } = req.body;

        try {
            // Check if the user exists in the database
            const user = await User.findOne({
                email
            });
            if (!user) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }

            // Check if the account is verified
            if (!user.verified) {
                return res.status(400).json({
                    message: "Please verify your email first"
                });
            }

            // Compare the entered password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });
            }

            // Generate a token for successful login
            const token = jwt.sign({
                userId: user._id
            }, jwtSecret, {
                expiresIn: '1h'
            });

            res.status(200).json({
                message: "Login successful",
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Server error"
            });
        }
    }


    //POST register section : /createAccount
    async createAccount(req, res) {
        const {
            email,
            password,
            confirmPassword
        } = req.body;

        try {
            const existingUser = await User.findOne({
                email
            });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email already exists'
                });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: 'Passwords do not match'
                });
            }

            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password: hashedPassword,
                verified: false, // Add a field for verification status
            });

            await newUser.save();

            // Generate a verification token (JWT)
            const token = jwt.sign({
                userId: newUser._id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            // Send the verification email
            sendVerificationEmail(email, token);

            res.status(201).json({
                message: 'User registered successfully! Please verify your email.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Server error'
            });
        }
    }

    // Verify email endpoint
    async verifyEmail(req, res) {
        const {
            token
        } = req.query;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            user.verified = true; // Set verified to true
            await user.save();

            res.status(200).json({
                message: 'Email verified successfully! You can now log in.'
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({
                message: 'Invalid or expired token'
            });
        }
    }




    // [GET] /logout
    logout(req, res) {
        req.session.destroy()
        res.redirect('/')
    }
}
module.exports = new SiteControllers();