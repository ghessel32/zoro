require('dotenv').config();
var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;
// Connect to MongoDB
mongoose.connect(mongoUri);
const plm = require("passport-local-mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String, // Store the image path
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
});

userSchema.plugin(plm);

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
