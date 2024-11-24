// Import required modules
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const mongoUri = process.env.MONGODB_URI;

// Connect to MongoDB database
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a schema for the tools data
const toolSchema = new mongoose.Schema({
  name: String,
  rating: String,
  img: String,
  para: String,
});

// Create a model based on the schema
const ToolModel = mongoose.model("Tools", toolSchema);

// Read and parse the tools.json file
const jsonData = fs.readFileSync("./tools.json");
const parsedData = JSON.parse(jsonData);

// Save each item from the parsed JSON data into the database
parsedData.forEach(async (item) => {
  try {
    const newTool = new ToolModel(item);
    await newTool.save();
    console.log("Tool saved successfully:", item);
  } catch (error) {
    console.error("Error saving tool:", error);
  }
});
