const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePath = "uploads/bookCovers"

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    coverImageName: {
        type: String, // This is the name of the file on the server's file system
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Author"
    }
    
})
// Virtual property derives its value from the other properties
bookSchema.virtual("coverImagePath").get(function() {
    //  The root folder is public
    if (this.coverImageName != null)
        return path.join("/", coverImageBasePath, this.coverImageName)
});


module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;