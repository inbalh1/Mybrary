const express = require("express");
const router = express.Router();

const Author = require("../models/author");

// All authors route
router.get("/", function(req, res) {
    res.render("authors/index");
});

// New author route
router.get("/new", function(req, res) {
    // The second argument has variables that will be sent to the .ejs file
    res.render("authors/new", {author: new Author()});
});

// Create an author
// In the video he used async await in here, but somehow I use it here without writing it explicitly
router.post("/", function(req, res) {
    const author = new Author({
        name: req.body.name
    });
    author.save().then(function (newAuthor) {
        //res.redirect("authors/${newAuthor.id}");
        res.redirect("authors");
    })
    .catch(function (err) {
        console.log(err);
        res.render("authors/new", {
            author: author,
            errorMessage: "Error creating Author"
            });
    });
    /*try {
        const newAuthor = await author.save();
        //res.redirect("authors/${newAuthor.id}");
        res.redirect("authors");        
    } catch {
        res.render("authors/new", {
            author: author,
            errorMessage: "Error creating Author"
            });        
    }*/
});

module.exports = router; // Export the router