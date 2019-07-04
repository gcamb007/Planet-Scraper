// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");

// Set mongoose to leverage promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;


// Handlebars
const exphbs = require("express-handlebars");
// app.set('views', path.join(__dirname, 'views/layouts/'));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Set up a static folder (public) for our web app
app.use(express.static(__dirname + '/public'));

// If deplyed, use the deployed database. Otherwise use the local mongo scraper database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/scraper";
// Connect to Mongo DB
mongoose.connect(MONGODB_URI);


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scraper");
// mongoose.connect("mongodb://127.0.0.1/scraper", {
//     useNewUrlParser: true
// });
// const db = mongoose.connection;


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


// Routes
const routes = require("./controllers/routes")(app);
// app.use("/", routes);


// Start the server
app.listen(port, function () {
    console.log("App running on " + port);
});