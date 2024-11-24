const User = require('../../models/Account')
const Admin = require('../../models/Admin-Account')
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
    const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${clientBaseUrl}/admin/verify-email?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Action Required: Verify Your Email Address',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Welcome to Our Service!</h2>
                <p>Thank you for signing up. Please confirm your email address to activate your account.</p>
                <p>
                    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                        Verify Email Address
                    </a>
                </p>
                <p>If you didn't sign up for this account, please disregard this email.</p>
                <p>Best regards,<br>The Team</p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};



class AdminControllers {
     // [POST] /admin/login
     async checkLoginAdmin(req, res) {
        const {
            email,
            password
        } = req.body;
        try {
            console.log("OKKKK")
            // Check if the user exists in the database
            const admin = await Admin.findOne({
                email
            });
            console.log(admin)
            console.log(admin.role)
            if (!admin) {
                return res.status(400).json({ 
                    message: "Invalid email or password"
                });
            }

            // Check if the account is verified
            if (!admin.verified) {
                return res.status(400).json({
                    message: "Please verify your email first"
                });
            }

            // Compare the entered password with the hashed password
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid email or password"
                });          
            }

            // Generate a token for successful login
            const token = jwt.sign({
                userId: admin._id
            }, jwtSecret, {
                expiresIn: '1h'
            });

            // res.status(200).json({
            //     message: "Login successful",
            //     token
            // });
            res.status(200).json({
                token,
                email: admin.email,
                userId: admin._id,
                role: admin.role
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
            const existingAdmin = await Admin.findOne({
                email
            });
            if (existingAdmin) {
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

            const newAdmin = new Admin({
                email,
                password: hashedPassword,
                verified: false, // Add a field for verification status
            });

            await newAdmin.save();

            // Generate a verification token (JWT)
            const token = jwt.sign({
                adminId: newAdmin._id
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
        console.log("Not good")

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await Admin.findById(decoded.adminId);

            if (!admin) {
                return res.status(404).json({
                    message: 'Admin not found'
                });
            }
 
            admin.verified = true; // Set verified to true
            await admin.save();

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
    async resentEmail(req, res) {
        try {
            const {
                email
            } = req.body;

            // Find the user by email
            const admin = await Admin.findOne({
                email
            });
            if (!admin) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Check if the user is already verified
            if (admin.verified) {
                return res.status(400).json({
                    message: 'User is already verified'
                });
            }

            // Generate a new verification token (if needed)
            const verificationToken = admin.verificationToken || crypto.randomBytes(32).toString('hex');
            admin.verificationToken = verificationToken;
            await admin.save();

            // Resend the email
            sendVerificationEmail(email, verificationToken);

            res.status(200).json({
                message: 'Verification email resent successfully.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Internal server error.'
            });
        }
    }
    // [GET] /changePassword
    async changePassword(req, res) {
        const {
            email,
            oldPassword,
            newPassword
        } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                message: 'All fields are required.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters.'
            });
        }

        try {
            const admin = await Admin.findOne({
                email
            });
            if (!admin) {
                return res.status(404).json({
                    message: 'Admin not found.'
                });
            }

            // Check if the old password matches
            const isMatch = await bcrypt.compare(oldPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Old password is incorrect.'
                });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Save the new password
            admin.password = hashedPassword;
            await admin.save();

            res.status(200).json({
                message: 'Password changed successfully.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Server error. Please try again later.'
            });
        }
    }

    // [GET] /logout
    logout(req, res) {
        req.session.destroy()
        res.redirect('/')
    }

}
module.exports = new AdminControllers();