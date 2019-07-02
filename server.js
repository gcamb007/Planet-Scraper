// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");


// Initialize Express
var app = express();
var port = process.env.PORT || 3000;


// Set mongoose to leverage promises
mongoose.Promise = Promise;


// Set up a static folder (public) for our web app
app.use(express.static("public"));


// // Database configuration ????????????????????
// // Save the URL of our database as well as the name of our collection
// var databaseUrl = "scraper";
// var collections = ["scrapedData"];


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/27017/scraper");
var db = mongoose.connection;

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


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
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// Routes
var routes = require("./controllers/routes.js");
app.use("/", routes);


// Start the server
app.listen(port, function () {
    console.log("App running on " + port);
});