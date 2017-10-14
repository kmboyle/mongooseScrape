const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const request = require("request");
const Article = require("./models/Article");
const Comments = require("./models/Comments");
mongoose.Promise = Promise;

var app = express();

var PORT = process.env.PORT || 3000;

//app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
//app.engine('handlebars', exphbs({ defaultLayout: "main" }));
//app.set('view engine', 'handlebars');

app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongooseScrape");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.get("/", function(req, res) {
    console.log("hello");
    Article.find({}, function(err, article) {
        if (err) {
            console.log(err);
        } else {
            console.log(article);
            res.json(article);
        }
    });
});

app.get("/scrape", function(req, res) {

    request("http://www.charlotteobserver.com/news/", function(error, response, html) {
        var $ = cheerio.load(html);
        var results = {};

        $("#story-list").children("article").each(function(i, element) {

            results.link = $(element).find(".title a").attr("href");
            results.title = $(element).find(".title a").text();
            results.summary = $(element).find(".summary").text();
            results.img = $(element).find("img").text();
            console.log(`title: ${results.title}
                link: ${results.link}
                img: ${results.img}
                summary: ${results.summary}`);
            var article = new Article(results);
            article.save(function(err, entry) {
                if (err) {
                    console.log(err);
                } else
                    console.log(entry);

            });

        });
    });
});

app.get("/articles", function(req, res) {
    Article.find({}, function(err, entry) {
        if (err) {
            res.send(err);
        } else {
            res.send(entry);
        }

    })
});
//get an article by its id and show the comments associated to it
app.get("/articles/:id", function(req, res) {
    Article.findOne({ _id: req.params.id })
        .populate("comment")
        .exec(function(err, entry) {
            if (err) {
                res.send(err);
            } else {
                console.log(entry);
                res.send(entry);
            }
        });
});
//this will create a new comment or replace an existing one
app.post("/articles/:id", function(req, res) {
    console.log("post req.body");
    console.log(req.body);

    console.log('post req.params.id');
    console.log(req.params.id);

    var newComment = new Comments(req.body);
    console.log('post new comment');
    console.log(newComment);

    //saving new comment to mongoose
    newComment.save(function(err, com) {
        if (err) {
            res.send(err);
        } else {
            Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    $push: {
                        "comment": newComment._id
                    }
                },
                function(err, newCom) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(newCom);
                    }
                });
        }
    });
});

// Delete One from the DB
app.get("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    console.log("deleted id");
    console.log(req.params.id);
    Comments.remove({
        _id: req.params.id
    }, function(error, removed) {
        // Log any errors from mongojs
        if (error) {
            console.log(error);
            res.send(error);
        }
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        else {
            console.log(removed);
            res.send(removed);
        }
    });
});



app.listen(PORT, function() {

    console.log("Server listening on port " + PORT);
});