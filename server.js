//require dependencies 
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


//require models for database 
var db = require("./models");

//require handlebars 
var exphbs = require("express-handlebars");
app.set("views" , "./views");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine", ".handlebars"); 

 

//logger (morgan)
app.use(logger("dev")); 
//body parser 
app.use(bodyParser.urlencoded({extended: false})); 

//static dir
app.use(express.static("public"));

//require routes 
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app); 

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
var PORT = process.env.PORT ||3000;
app.listen(process.env.PORT || 3000, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
