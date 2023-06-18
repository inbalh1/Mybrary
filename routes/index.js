const express = require("express");
const router = express.Router();
const Book = require("../models/book");

router.get("/", async function(req, res) {
    let books;

    try {
        books = await Book.find().sort({createdAt: "desc"}).limit(5).exec();

    } catch (err) {
        console.log(err);
        books = [];
    }
    res.render("index", {
        books: books
    });

    
}); // Use the get action

module.exports = router; // Export the router