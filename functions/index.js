
const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const http = require("http");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressSession = require("express-session");
const flash = require("connect-flash");

var indexRouter = require("../routes/index.js");
var usersRouter = require("../routes/users");
const passport = require("passport");
const socketIo = require("socket.io");

var app = express();
const server = http.createServer(app);
const io = socketIo(server);

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(flash());

app.use(
  expressSession({
    secret: "your secret key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/api", express.static(path.join(__dirname, "api")));
// Serve the socket.io.js file from the /socket.io/ path

const uploadDirectory = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadDirectory));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("../views/error.ejs");
});



// Export the Express app as an HTTP function
exports.app = functions.https.onRequest(app);
