// mongoose is the library that connects us to mongodb
const mongoose = require("mongoose");
const Book = require('../models/book');

// schema is a table in the database
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        }
});

// This method will be called before deleteOne
// next - this is the action that suppose to come after the remove
authorSchema.pre('deleteOne', async function(next) {
    try {
        const books = await Book.find({author: this.id});
        if (books.length > 0){
            next(new Error("This author has books still"));
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
});

// Author is the name of the module,  which is also the name of the table in the db
module.exports = mongoose.model("Author", authorSchema);