// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

// Requiring Comment and Article models
const db = require("../models");

// HTML Routes
module.exports = function (app) {
    app.get("/", function (req, res) {

        res.render("index");
    });

    // API Routes
    // A GET route for scraping the BBC website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.bbc.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(res.data);

            // Now, we grab the information from the article html elements, and do the following:
            //Articles with images
            $(".media").each(function (i, element) {
                // Save an empty result object
                var result = {};
                // Add the text and href of every link, and save them as properties of the result object
                result.imageLink = $(this)
                    .children(".media_image")
                    .children(".responsive_image")
                    .children("a")
                    .children("img")
                    .attr("src")
                result.title = $(this)
                    .children(".media_content")
                    .children("h3")
                    .children(".media_title")
                    .text();
                result.preview = $(this)
                    .children("p")
                    .children(".media_summary")
                    .text();
                result.link = $(this)
                    .children("h3")
                    .children("a")
                    .children(".media_link")
                    .attr("href");
                result.location = $(this)
                    .children("media_content")
                    .children("a")
                    .children("media_tag")
                    .attr("href")

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
};