// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");


// Initialize Express
const app = express();
const port = process.env.PORT || 3000;


// Set mongoose to leverage promises
mongoose.Promise = Promise;


// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scraper");
mongoose.connect("mongodb://127.0.0.1/scraper", { useNewUrlParser: true });
// const db = mongoose.connection;


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder


// Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// Routes
const routes = require("./controllers/routes")(app);
// app.use("/", routes);


// Start the server
app.listen(port, function () {
    console.log("App running on " + port);
});