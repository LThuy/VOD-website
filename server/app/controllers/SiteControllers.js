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
    const verificationUrl = `${clientBaseUrl}/verify-email?token=${token}`;
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
// sende email forget pass
const sendResetEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
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
                expiresIn: '7d'
            });

            // res.status(200).json({
            //     message: "Login successful",
            //     token
            // });
            res.status(200).json({
                token,
                email: user.email,
                userId: user._id,
                role: user.role
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
    async resentEmail(req, res) {
        try {
            const {
                email
            } = req.body;

            // Find the user by email
            const user = await User.findOne({
                email
            });
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Check if the user is already verified
            if (user.verified) {
                return res.status(400).json({
                    message: 'User is already verified'
                });
            }

            // Generate a new verification token (if needed)
            const verificationToken = user.verificationToken || crypto.randomBytes(32).toString('hex');
            user.verificationToken = verificationToken;
            await user.save();

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
            const user = await User.findOne({
                email
            });
            if (!user) {
                return res.status(404).json({
                    message: 'User not found.'
                });
            }

            // Check if the old password matches
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Old password is incorrect.Try again!'
                });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Save the new password
            user.password = hashedPassword;
            await user.save();

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
    // [post] /forgetpassword
    async forgetPassword(req, res) {
        const {
            email
        } = req.body;

        try {
            const account = await User.findOne({
                email
            });

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: 'Account not found'
                });
            }

            // Generate reset token
            const resetToken = jwt.sign({
                email
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });
            console.log('Generated reset token:', resetToken);

            account.verificationToken = resetToken;
            await account.save();

            const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';
            const resetUrl = `${clientBaseUrl}/reset-password/${resetToken}`;

            const emailContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
                    <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        You recently requested to reset your password. Click the button below to reset it:
                    </p>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
                    </div>
                    <p style="font-size: 16px; margin-bottom: 20px;">
                        If you didn't request this, please ignore this email. Your account will remain secure.
                    </p>
                    <p style="font-size: 14px; color: #555;">Thank you,<br>The Support Team</p>
                </div>
            `;


            try {
                await sendResetEmail(email, 'Password Reset Request', emailContent);
            } catch (emailError) {
                console.error('Error sending reset email:', emailError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send reset email',
                    error: emailError
                });
            }

            res.status(200).json({
                success: true,
                message: 'Password reset email sent'
            });
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error
            });
        }
    }

    async resetPassword(req, res) {
        const {
            resetToken,
            password
        } = req.body;

        try {
            console.log('Reset token received:', resetToken); // Log the token to check if it's correct

            // Check for a user matching the reset token
            const user = await User.findOne({
                verificationToken: resetToken
            });

            // Log the user to see which account is being returned
            console.log('User found for password reset:', user);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or expired token.'
                });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hashed password:', hashedPassword); // Log the hashed password

            // Update the password and clear the reset token
            user.password = hashedPassword;
            user.verificationToken = null; // Clear the reset token after the password has been reset

            // Save the updated user document
            const savedUser = await user.save();
            console.log('User saved successfully:', savedUser); // Log the saved user

            res.json({
                success: true,
                message: 'Password reset successfully.'
            });
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({
                success: false,
                message: 'Server error.'
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