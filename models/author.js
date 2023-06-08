// mongoose is the library that connects us to mongodb
const mongoose = require("mongoose");

// schema is a table in the database
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        }
});

// Author is the name of the module,  which is also the name of the table in the db
module.exports = mongoose.model("Author", authorSchema);