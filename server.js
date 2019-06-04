var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");


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


// add controller to server 

router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.beeradvocate.com/articles").then(function(response) {
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".teaser").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.summary = $(this)
         .children(".excerpt") 
         .text(); 

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
         
          window.location.href("/");
      
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});
//   original working below
router.get("/", function(req, res) {
// Grab every document in the Articles collection
  db.Article.find({})
      .then(function(data) {
      // If we were able to successfully find Articles, send them back to the client

      var hbsObject = {
          articles: data,
          };
      
          console.log(hbsObject);
          res.render("index", hbsObject);
      })
      .catch(function(err) {
      // If an error occurred, send it to the client
          res.json(err);
      });
});

router.get("/articles", function(req, res) {
// Grab every document in the Articles collection
  db.Article.find({})
      .then(function(dbArticle) {

          res.json(dbArticle);
      })
      .catch(function(err) {
      // If an error occurred, send it to the client
          res.json(err);
      });
});

router.get("/notes", function(req, res) {
  // Grab every document in the Articles collection
      db.Note.find({})
          .then(function(dbNotes) {
  
              res.json(dbNotes);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
              res.json(err);
          });
  });

router.get("/notes/:id", function(req, res) {
  // Grab every document in the Articles collection
      db.Note.findOne({ _id: req.params.id })
          .then(function(dbNotes) {
  
              res.json(dbNotes);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
              res.json(err);
          });
  });

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  .then(function(dbArticle) {
  // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
  })
  .catch(function(err) {
  // If an error occurred, send it to the client
      res.json(err);
  });
});

router.get("/articles/:id/", function(req, res) {
// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.find({ _id: req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  .then(function(dbArticle) {
  // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
  })
  .catch(function(err) {
  // If an error occurred, send it to the client
      res.json(err);
  });
});

router.post("/articles/:id", function(req, res) {
// Create a new note and pass the req.body to the entry
db.Note.create(req.body)
  .then(function(dbNote) {
    
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push : {note: dbNote._id }}, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {

    res.json(err);
  });
});


router.delete("/notes/:id" , function(req, res) {

  db.Note.findOneAndRemove({_id: req.params.id})
  .then(function(dbNote){
    res.json(dbNote);
    
  })

.catch(function(err) {
res.json(err);
})
});



// end of controller 
// mongoose.connect("mongodb://localhost/Scraper", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Scraper";

mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
