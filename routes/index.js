var express = require("express");
const userModel = require("./users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Read the JSON data from index.json
const [tutorialsData, toolsData] = ["index.json", "tools.json"].map((file) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, `../${file}`)))
);

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "plrseller007@gmail.com", // Your Gmail email address
    pass: "udqjjbpcuamdecnp", // Your Gmail password
  },
});

passport.use(new LocalStrategy(userModel.authenticate()));

const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", {
    tutorials: tutorialsData, // Pass tutorials data to the template
    tools: toolsData, // Also pass tools data to the template
  });
});

module.exports = router;
