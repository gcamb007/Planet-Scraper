// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");


// Initialize Express
var app = express();
var port = process.env.PORT || 3000;


// Requiring the `User` model for accessing the `users` collection
var User = require("./models");


// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Handlebars




// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes
var routes = require("./controllers/routes.js");
app.use("/", routes);

// Start the server
app.listen(port, function () {
    console.log("App running on " + port);
});