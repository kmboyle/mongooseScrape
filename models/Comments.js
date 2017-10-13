// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var commentSchema = new Schema({
    // Just a string
    title: {
        type: String
    },
    // Just a string
    body: {
        type: String
    }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Comments = mongoose.model("Comments", commentSchema);

// Export the Note model
module.exports = Comments;