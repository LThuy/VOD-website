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

    async getAdmins(req, res) {
        try {
            const users = await Account.find({
                role: 'admin'
            });
            console.log(users)
            res.send(users);
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching users',
                error
            });
        }
    }
    async getAdminsInfo(req, res) {
        try {
            const { id } = req.params;
            const admin = await Account.findOne({ _id: id, role: 'admin' });
            
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            
            res.json({ message: 'Admin fetched successfully', admin });
        } catch (error) {
            res.status(500).json({
                message: 'Error fetching admin',
                error
            });
        }
    }

    async updateAdminInfo(req, res) {
        try {
            const { id } = req.params;
            let updatedData = req.body
            
            const updatedAdmin = await Account.findOneAndUpdate(
                { _id: id, role: 'admin' },
                { email: updatedData.email, username: updatedData.username },
                { new: true }
            );
            
            if (!updatedAdmin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            
            res.json({ message: 'Admin updated successfully', updatedAdmin });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating admin',
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
        const {
            userId
        } = req.params.userId;

        try {
            const user = await Account.findById(id);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Calculate total online time in seconds
            const totalOnlineTime = user.sessions.reduce((total, session) => {
                const startTime = new Date(session.startTime).getTime();
                const endTime = session.endTime ? new Date(session.endTime).getTime() : Date.now();
                return total + (endTime - startTime) / 1000; // Convert milliseconds to seconds
            }, 0);

            res.status(200).json({
                userId: user._id,
                totalOnlineTime, // Time in seconds
            });
        } catch (error) {
            console.error('Error fetching online time:', error);
            res.status(500).json({
                message: 'Server error'
            });
        }
    }
}

module.exports = new UserControllers();