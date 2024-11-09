const User = require('../../models/Account')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

class SiteControllers {
    //GET login section : /checkLogin
    async checkLogin(req, res) {
        const {
            username,
            password
        } = req.body;

        try {
            // Check if the user exists in the database
            const user = await User.findOne({ username });
            if (!user) {
              return res.status(400).json({ message: 'Invalid username or password' });
            }
        
            // Compare the entered password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return res.status(400).json({ message: 'Invalid username or password' });
            }
        
            // If you want to use JWT for authentication (optional)
            const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
        
            // Respond with a success message and optionally the token
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }

    }
    //POST register section : /createAccount
    async createAccount(req, res) {
        const {
            username,
            password,
            confirmPassword
        } = req.body;

        try {
            const existingUser = await User.findOne({
                username
            });
            if (existingUser) {
                return res.status(400).json({
                    message: "Username already exists"
                });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: "Passwords do not match"
                });
            }

            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                password: hashedPassword,
            });

            await newUser.save();

            res.status(201).json({
                message: "User registered successfully!"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Server error"
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