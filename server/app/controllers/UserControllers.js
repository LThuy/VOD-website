const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Account = require('../../models/Account')

class UserControllers {
    async getUsers(req, res) {
        try {
            const users = await Account.find({ role: 'user' });
            res.send(users);
          } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
          }
    }

    async handleLockUnlock(req, res) {
        const { id } = req.params
        const { locked } = req.body

        try {
            const user = await Account.findById(id)
            if (!user) {
            return res.status(404).json({ message: 'User not found' })
            }

            user.locked = locked
            await user.save()

            res.json(user)
        } catch (error) {
            res.status(500).json({ message: 'Error updating user status', error })
        }
    }
}

module.exports = new UserControllers();