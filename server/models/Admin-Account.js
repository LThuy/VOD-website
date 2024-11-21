const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Admin schema
const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true, 
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: true, // Ensures password is not returned by default in queries
    },
    role: {
      type: String, 
      enum: ['superadmin', 'admin', 'moderator'],
      default: 'admin',
    },
    verified: {
      type: Boolean, 
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Middleware to hash password before saving (requires bcrypt or similar)
// AdminSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const bcrypt = require('bcrypt');
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// Export the model
const Admin = mongoose.model('admin-accounts', AdminSchema);

module.exports = Admin;
