var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://parjapatrahul2006:CQczUo1iEyZAZbTd@users.b6gfdic.mongodb.net/brainiac"
);
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
