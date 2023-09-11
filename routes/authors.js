const express = require("express");
const router = express.Router();

const Author = require("../models/author");
const Book = require('../models/book');

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
        res.redirect(`authors/${newAuthor.id}`);
        console.log(`Author ${newAuthor.name} added successfully`)
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

router.get("/:id", async function(req, res) {
    try {
        const author = await Author.findById(req.params.id);
        const booksByAuthor = await Book.find({author: author.id}).limit(6).exec();
        res.render("authors/show", {
            author: author,
            booksByAuthor: booksByAuthor
            });
    } catch(err) {
        console.log(err);
        res.redirect("/");
    }
});

router.get("/:id/edit", async function(req, res) {
    try {
        const author = await Author.findById(req.params.id);
        res.render("authors/edit", {author: author});
    } catch(err) {
        console.log(err);
        res.redirect("/authors");
    }
});

// Notice the route lookup goes from top to buttom, so this has to be after "/new" route
// Update page
router.put("/:id", async function(req, res) {
    // Must define outside the try block
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        author.save().then(function (author) {
            res.redirect(`/authors/${author.id}`);
        })
        .catch(function (err) {
            console.log(err);
            res.render("authors/edit", {
                author: author,
                errorMessage: "Error updating Author"
                });
        });
    } catch(err) {
        console.log(err);
        res.redirect("/");
    }
});

router.delete("/:id", async function(req, res) {
    // Must define outside the try block
    let author;
    try {
        author = await Author.findById(req.params.id);
        // Is there something like save->then  for remove?
        await Author.deleteOne({_id: author.id});
        res.redirect('/authors');
    } catch(err) {
        if (author == null) {
            res.redirect("/");
        }
        else {
            res.redirect(`/authors/${author.id}`);
        }
        console.log(err);
        
    }
});

module.exports = router; // Export the router