//npm i express ejs express-ejs-layouts
// nodemon refreshes our server everytime we make a change (good for developing enviornment)
//npm i --save-dev nodemon
//npm i mongoose  // Allows integrating with mongoDb
//npm i  --save-dev dotenv // Allows adding env variables to the file .env
//npm i body-parser // Helps parsing input elements(from ejs files)
// npm i multer // Work with files
// Run with "npm start" so it will refresh <- No it didnt work, find out how. Maybe its "npm run devStart".


// the variable process.env.NODE_ENV is set  automatically by nodeJs
if (process.env.NODE_ENV !== "production") {
    //require("dotenv").parse();
    require('dotenv').config()
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

const mongoose = require("mongoose");
// From  some reason mongoose doesnt work well (todo: check online for solution)
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
.then(()=>console.log('Connected to mongoose'))
.catch(e=>console.log("Error connecting to mongo: " +  e));

const db = mongoose.connection;
// If we run into an error
db.on("error", error => console.error(error));
// This will run only once, when we connect to mongoose
// TODO: this is redundant
db.once("open", () => console.log("Connected to mongoose"));

// The index router should handle the root
app.use("/", indexRouter);
// All routes inside authorRouter will prepadded with "/authors"
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

// In  deployment we'll have an env variable
app.listen(process.env.PORT || 3000);

