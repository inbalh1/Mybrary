//npm i express ejs express-ejs-layouts
// nodemon refreshes our server everytime we make a change (good for developing enviornment)
//npm i --save-dev nodemon
//npm i mongoose  // Allows integrating with mongoDb
//npm i  --save-dev dotenv // Allows adding env variables to the file .env

// the variable process.env.NODE_ENV is set  automatically by nodeJs
if (process.env.NODE_ENV !== "production") {
    //require("dotenv").parse();
    require('dotenv').config()
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index.js");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
//mongoose.connect("mongodb://localhost/mybrary", {useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", error => console.error(error)); // If we run into an error
db.once("open", () => console.log("Connected to mongoose")); // This will run only once, when we connect to mongoose

app.use("/", indexRouter); // The index router should handle the root
// In  deployment we'll have an env variable
app.listen(process.env.PORT || 3000);

