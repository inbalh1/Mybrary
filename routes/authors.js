const express = require("express");
const router = express.Router();

const Author = require("../models/author");

// All authors route
router.get("/", async function(req, res) {
    let searchOpt = {}
    if (req.query.name != null && req.body.name != "") {
        searchOpt.name = new RegExp(req.query.name, "i");
    }
    // TODO: how to do it with then, catch?
    try {
        authors = await Author.find(searchOpt);
        res.render("authors/index", {
            searchOptions: req.query,
            authors: authors
        });
    } catch(err) {
        console.log(err);
        res.redirect("/");
    }
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
        console.log(`Author ${newAuthor.name} added successfully`)
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