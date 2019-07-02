var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({

    // "title" must be of type String
    // "title" is a required field and throws a custom error message if not supplied
    title: {
        type: String,
        required: true
    },

    // "link" must be of type String
    // "link" is a required field and throws a custom error message if not supplied
    link: {
        type: String,
        required: true
    },

    // "image" must be of type String
    // "image" is a required field and throws a custom error message if not supplied
    image: {
        type: String
    },

    // "preview" must be of type String
    // "preview" is a required field and throws a custom error message if not supplied
    preview: {
        type: String
    },

    // "comments" must follow CommentSchema type
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        validate: [
            function(input) {
              return input.length <= 250;
            },
            "250 characters or less."
          ]
    }]

});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Comment model
module.exports = Article;