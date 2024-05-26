var express = require("express");
const userModel = require("./users");
const Feedback = require("../feedback");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// Read the JSON data from index.json
const jsonData = fs.readFileSync(path.join(__dirname, "../index.json"));
const tutorialsData = JSON.parse(jsonData);

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

// Define Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define your upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/about", function (req, res, next) {
  res.render("about");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

// Route to display initial courses
router.get("/All-Tutorials", isLoggedIn, function (req, res, next) {
  // Instead of slicing, use the entire tutorialsData array
  const allTutorials = tutorialsData;
  res.render("courses", {
    tutorials: allTutorials,
    user: req.user,
    avatar: req.user.avatar,
  });
});

// Route to load more courses dynamically
router.get("/load-more-courses", function (req, res, next) {
  // Assuming you have some way to track pagination (e.g., using query parameters)
  const page = parseInt(req.query.page) || 1;
  const pageSize = 4; // Number of courses to load per page
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Slice the array to get the courses for the current page
  const coursesForPage = tutorialsData.slice(startIndex, endIndex);

  res.json(coursesForPage);
});

router.get("/Collection", isLoggedIn, function (req, res, next) {
  res.render("saveCs", { user: req.user, avatar: req.user.avatar });
});

router.get("/tutorial-:title", isLoggedIn, function (req, res, next) {
  const tutorialTitle = req.params.title; // Retrieve the tutorial title from the URL path
  res.render("tutorial", { title: tutorialTitle, user: req.user }); // Pass the title to the template
});

router.get("/dashboard", isLoggedIn, async function (req, res, next) {
  try {
    // Find the user data including the avatar path
    const user = await userModel.findOne({ username: req.user.username });

    // Assuming tutorialsData is an array of tutorials
    const startIndex = 5; // Start index for slicing
    const endIndex = tutorialsData.length; // End index for slicing
    const nextTutorials = tutorialsData.slice(startIndex, endIndex);

    res.render("dash", { user, nextTutorials });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.post("/register", async function (req, res, next) {
  try {
    // Check if the email already exists in the database
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      throw new Error("Email address already exists. ");
    }

    // Create a new user if the email is unique
    const userData = new userModel({
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
    });

    // Register the user
    const registeredUser = await userModel.register(
      userData,
      req.body.password
    );

    // Send congratulatory email
    const mailOptions = {
      from: "plrseller007@gmail.com", // Replace with your actual email address
      to: req.body.email,
      subject: "Welcome to the Brainiac Community", // Personalized subject line
      text: `
      Hi ${req.body.fullName},
      
      Thanks for joining the Brainiac community! We're excited to have you on board.
      
      We're here to help you get started. Check out our resources page: [link to resources page]
      
      If you have any questions, don't hesitate to reply to this email or reach out to our support team at [support email address].
      
      Welcome aboard!
      
      Best regards,
      
      The Brainiac Team
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    passport.authenticate("local")(req, res, function () {
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.render("register", { error: err.message }); // Pass error message to register page
  }
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile", { user: req.user });
});

// Modify the profile route to handle file upload
router.post(
  "/profile",
  isLoggedIn,
  upload.single("avatar"),
  async function (req, res, next) {
    try {
      // Update the user's profile picture path in the database
      req.user.avatar = req.file.path;

      // Save the user with updated profile picture path
      await req.user.save();

      // Redirect to profile page
      res.redirect("/profile");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.render("profile", {
        user: req.user,
        error: "Failed to upload profile picture",
      }); // Pass error message to profile page
    }
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

router.get("/feedback", isLoggedIn, function (req, res, next) {
  res.render("feedback");
});

router.post("/feedback", isLoggedIn, async function (req, res, next) {
  try {
    // Retrieve the user's full name and username from the session
    const fullName = req.user.fullName;
    const username = req.user.username;

    // Create a new feedback instance
    const newFeedback = new Feedback({
      fullName: fullName,
      username: username,
      feedback: req.body.feedback,
      rating: parseInt(req.body.rating), // Convert rating to a number
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Redirect to dashboard or any other page after feedback submission
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.render("feedback", { error: "Failed to submit feedback" });
  }
});

router.get("/contact", function (req, res, next) {
  res.render("contact");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.avatar = req.user.avatar; // Pass the avatar path to the template
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
