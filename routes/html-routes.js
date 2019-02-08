var path = require("path");
var db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                
                var hbsObject ={
                    articles:dbArticle
                }
                res.render("index", hbsObject)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

}
