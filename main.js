// Import required modules
const mongoose = require("mongoose");
const fs = require("fs");

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/tutorials", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a schema for the data
const dataSchema = new mongoose.Schema({
  h3: String,
  dataName: String,
  level: String,
  img: String,
  p: String,
  isrc: String,
  time: String,
});

// Create a model based on the schema
const DataModel = mongoose.model("Data", dataSchema);

// Read and parse the index.json file
const jsonData = fs.readFileSync("./index.json");
const parsedData = JSON.parse(jsonData);

// Save each item from the parsed JSON data into the database
parsedData.forEach(async (item) => {
  try {
    const newData = new DataModel(item);
    await newData.save();
    console.log("Data saved successfully:", item);
  } catch (error) {
    console.error("Error saving data:", error);
  }
});
