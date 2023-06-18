const express = require("express");
const multer = require("multer");// For uploading files
const path = require("path");
const fs = require("fs"); // interacting with the file system (specifically, we use for deleting files)
const Book = require("../models/book");
const uploadPath = path.join("public", Book.coverImageBasePath);
const Author = require("../models/author");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const router = express.Router();

upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
});

// All books route
router.get("/", async function(req, res) {
    let query = Book.find(); // Create a matching query
    if (req.query.title != null && req.query.title != "") {
        query = query.regex("title",  new RegExp(req.query.title, "i"));
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query = query.gte("publishDate", req.query.publishedAfter);
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query = query.lte("publishDate", req.query.publishedBefore);
    }
    try {
        const books = await query.exec();
        res.render("books/index", {
            searchOptions: req.query,
            books: books
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});

// New book route
router.get("/new", async function(req, res) {
    let newBook = new Book();
    renderNewPage(newBook, res);
});

// Create book route
router.post("/", upload.single("cover"), function(req, res) {
    //multer added a variable req.file
    const fileName = req.file != null ? req.file.filename: null;
    let newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    });
    newBook.save().then(function(newBook) {
        console.log(`Book ${newBook.title} added successfully`);
        //res.redirect(`/books/${newBook.id}`);
        res.redirect("books");
    }).catch(function(err) {
        console.log("Creating a book failed")
        console.log(err);
        removeFile(newBook.coverImageName);
        renderNewPage(newBook, res, true)
    });
});


function removeFile(fileName) {
    if (fileName != null) {
        fs.unlink(path.join(uploadPath, fileName), (err)=> {
            if (err)
                console.error(err)
        });
    }

}

async function renderNewPage(newBook, res, hasError=false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: newBook
        }
        if (hasError) {
            params.errorMessage = "Error creating book"
        }
        res.render("books/new", params);
    } catch(err) {
        console.log(err);
        res.redirect("books");
    }
}

module.exports = router; // Export the router