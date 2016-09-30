var router = require("express").Router();
var User = require("../models/users");
var passport = require("passport");
var passportConf = require("../config/passport");
router.get('/login', function (req, res, next) {
    if (req.user) return res.redirect('/');
    res.render("accounts/login", {
        message: req.flash("loginMessage")
    });

});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', function (req, res, next) {
    User.findOne({_id: req.user._id}, function (err, user) {
        if (!user) return next(err);
        res.render("accounts/profile", {
            user: user
        });
    });

});
router.post('/signup', function (req, res, next) {

    var user = new User();

    user.profile.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    user.profile.picture = user.gravatar();

    User.findOne({email: req.body.email}, function (err, existingUser) {
        if (existingUser) {
            req.flash('errors', 'Acount with that email already exists');
            return res.redirect("/signup");
        } else {
            user.save(function (err) {
                if (err) return next(err);
                req.logIn(user, function(err){
                    if (err) return next(err);
                    res.redirect("/profile");

                });
            });

        }
    });
});

router.get('/signup', function (req, res, next) {
    res.render("accounts/signup", {
            errors: req.flash("errors")
        }
    );
});

router.get('/logout',function(req,res,next){
   req.logout();
    res.redirect('/');
});
module.exports = router;
