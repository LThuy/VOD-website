const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Account = require('../../models/Account')
const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
class UserControllers {
    async getUsers(req, res) {
        try {
            const users = await Account.find({
                role: 'user'
            });
            res.send(users);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching users',
                error
            });
        }
    }

    async handleLockUnlock(req, res) {
        const {
            id
        } = req.params
        const {
            locked
        } = req.body

        try {
            const user = await Account.findById(id)
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }

            user.locked = locked
            await user.save()

            res.json(user)
        } catch (error) {
            res.status(500).json({
                message: 'Error updating user status',
                error
            })
        }
    }
    async trackingTimeUsers(req, res) {
        const {
            time
        } = req.body; // Time in milliseconds
        const userId = req.params.userId
        console.log(userId)
        console.log("trackingTimeUsers")
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        try {
            // Update user's online time
            const account = await Account.findByIdAndUpdate(
                userId, {
                    $inc: {
                        onlineTime: time
                    }
                }, // Increment online time
                {
                    new: true
                }
            );

            if (!account) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Online time updated successfully",
                onlineTime: account.onlineTime
            });
        } catch (error) {
            console.error("Error updating online time:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
    async getOnlineTimeUsers(req, res) {
        const userId = req.params.userId
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const userId = decoded.userId;

            const account = await Account.findById(userId, "onlineTime username email");
            if (!account) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Online time retrieved successfully",
                onlineTime: account.onlineTime,
                username: account.username,
                email: account.email,
            });
        } catch (error) {
            console.error("Error fetching online time:", error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

module.exports = new UserControllers();