var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var conf = require("./config");
var bodyParser = require("body-parser");
var User = require("./models/users");
var Category = require("./models/category");
var ejs = require("ejs");
var engine = require("ejs-mate");
var session = require("express-session");
var cookie = require("cookie-parser");
var flash = require("express-flash");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var main = require("./routes/main");
var users = require("./routes/user");
var admin = require("./routes/admin");
var api = require("./api/api");
mongoose.connect(conf.getDbConnectionConfig());

var app = express();
//Middleware
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: conf.secretKey,
    store: new MongoStore({url: conf.getDbConnectionConfig(), autoReconnect: true})
}));
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
app.use(function (req, res, next) {
    Category.find({},function(err,category){
        if(err) return next(err);
        res.locals.categories = category;
        next();
    });

});
app.use(passport.initialize());
app.use(passport.session());

app.use(main);
app.use(users);
app.use(admin);
app.use('/api',api);
app.engine("ejs", engine);
app.set("view engine", 'ejs');
app.listen(3000, function (err) {
    if (err) throw err;
    console.log("localhost 3000");
});

