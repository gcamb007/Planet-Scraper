var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
var CommentSchema = new Schema({
    // "author" is of type String
    author: {
        type: String
    },
    // "body" is of type String
    body: {
        type: String
    },

    // "comments" must be validated with a max number of characters
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        validate: [
            function (input) {
                return input.length <= 250;
            },
            "250 characters or less."
        ]
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;