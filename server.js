var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3001;

// Initialize Express
var app = express();


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/scraper_controller");

app.use(routes);

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/Scraper", { useNewUrlParser: true });

var MONGODB_URI = "mongodb://heroku_0f6n41sd:JuAUE7AV2LLpbWg@ds131747.mlab.com:31747/heroku_0f6n41sd" || ("mongodb://localhost/Scraper", { useeNewUrlParser: true});

mongoose.connect(MONGODB_URI);

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
