const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
const ArticleSchema = new Schema({

    // "image" must be of type String
    // "image" is a required field and throws a custom error message if not supplied
    imageLink: {
        type: String
    },

    // "title" must be of type String
    // "title" is a required field and throws a custom error message if not supplied
    title: {
        type: String,
        required: true
    },

    // "preview" must be of type String
    // "preview" is a required field and throws a custom error message if not supplied
    snipText: {
        type: String
    },

    // "link" must be of type String
    // "link" is a required field and throws a custom error message if not supplied
    link: {
        type: String,
        required: true
    },

    // "location" must be of type String
    // "location" is not a required field
    location: {
        type: String,
        required: false
    },

});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Comment model
module.exports = Article;