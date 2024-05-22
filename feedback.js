const mongoose = require('mongoose');

// Define the feedback schema
const feedbackSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Feedback model using the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
