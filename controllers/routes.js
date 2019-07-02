// Dependencies
// var mongojs = require("mongojs");
var express = require("express");

// Initialize Express
// var app = express();

// Require axios and cheerio. This makes the scraping possible
var cheerio = require("cheerio");
var request = require("request");

// Requiring Comment and Article models
var Comment = require("../models/Comment,js");
var Article = require("../models/Article.js");

// Set up a static folder (public) for our web app
app.use(express.static("public"));

var port = process.env.PORT || 3000;

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("Database Error:", error);
});


// Routes

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbComment._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// A GET route for scraping the BBC website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.bbc.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab the information from the article html elements, and do the following:
        //Articles with images
        $(".has-image").each(function (i, element) {
            // Save an empty result object
            var result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.link = $(this)
                .children(".item-info")
                .children(".title")
                .children()
                .attr("href");
            result.title = $(this)
                .children(".item-info")
                .children(".title")
                .children()
                .text();
            result.snipText = $(this)
                .children(".item-info")
                .children(".teaser")
                .children("a")
                .text();
            result.imageLink = $(this)
                .children(".item-image")
                .children(".imagewrap")
                .children("a")
                .children("img")
                .attr("src");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        //Articles without images
        $(".no-image").each(function (i, element) {
            // Save an empty result object
            var result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.link = $(element)
                .children(".item-info")
                .children(".title")
                .children()
                .attr("href");
            result.title = $(element)
                .children(".item-info")
                .children(".title")
                .children("a")
                .text();
            result.snipText = $(element)
                .children(".item-info")
                .children(".teaser")
                .children()
                .text();
            result.imageLink = "no image";

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Concole log the results from the scraped articles
        console.log(results);

        res.redirect("/");

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's comment
app.get("/article/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({
            "_id": req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("comments")
        // now, execute our query
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated comments
app.post("/articles/:id", function (req, res) {
    // Create a new comment and pass the req.body to the entry
    db.Comments.create(req.body)
        .then(function (dbComments) {
            // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                comment: dbComments._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

module.exports = routes;