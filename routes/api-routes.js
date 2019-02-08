var cheerio = require("cheerio");
var request = require("request");
var db = require("../models");
module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        request("https://www.nhl.com/", function (error, response, html) {

            // Load the body of the HTML into cheerio
            var $ = cheerio.load(html);

            // Empty array to save our scraped data
            var results = [];

            // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
            $("h4.headline-link").each(function (i, element) {

                // Save the text of the h4-tag as "title"
                var title = $(element).text();

                // Find the h4 tag's parent a-tag, and save it's href value as "link"
                var link = "https://www.nhl.com/" +  $(element).parent().attr("href");

                // Make an object with data we scraped for this h4 and push it to the results array
                results.push({
                    title: title,
                    link: link
                }); //results pushed

                // Insert the data in the scrapedData db
                db.Article.create({
                    title: title,
                    link: link
                }).then(function (dbArticle) {
                    console.log(dbArticle);

                })

            }); //element


        });
        res.send("scrape complete")
    }); //scrape

  

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
//     // Update just one note by an id
app.post("/update/:id", function(req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IdYouWantToFind))
  
    // Update the note that matches the object id
    db.Articles.update(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      {
        // Set the title, note and modified parameters
        // sent in the req body.
        $set: {
          saved:true
        }
      },
      function(error, edited) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(edited);
          res.send(edited);
        }
      }
    );
  });

}//exports