const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
}); // Use the get action

module.exports = router; // Export the router