var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3001;

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
mongoose.connect("mongodb://localhost/Scraper", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
