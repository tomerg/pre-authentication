var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/beers');

var Beer = require("./models/BeerModel");
var Review = require("./models/ReviewModel");
var User = require("./models/UserModel");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));
app.use(express.static('node_modules'));

//------------------------
// For authentication:
var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());
//------------------------

app.get('/beers', function (req, res) {
  Beer.find(function (error, beers) {
    res.send(beers);
  });
});

app.post('/beers', function (req, res, next) {
  var beer = new Beer(req.body);

  beer.save(function(err, beer) {
    if (err) { return next(err); }

    res.json(beer);
  });
});

app.put('/beers/:id',  function(req, res, next) {
  Beer.findById(req.params.id, function (error, beer) {
    beer.name = req.body.name;

    beer.save(function(err, beer) {
      if (err) { return next(err); } 

      res.json(beer);
    });
  });
});

app.delete('/beers/:id', function (req, res) {
  Beer.findById(req.params.id, function (error, beer) {
    if (error) {
      res.status(500);
      res.send(error);
    } else {
      beer.remove();
      res.status(204);
      res.end();
    }
  });
});

app.post('/beers/:id/reviews', function(req, res, next) {
  Beer.findById(req.params.id, function(err, beer) {
    if (err) { return next(err); }

    var review = new Review(req.body);

    beer.reviews.push(review);

    beer.save(function (err, beer) {
      if (err) { return next(err); }
    
      res.json(review);
    });
  });
});

app.delete('/beers/:beer/reviews/:review', function(req, res, next) {
  Beer.findById(req.params.beer, function (err, beer) {
    for (var i = 0; i < beer.reviews.length; i ++) {
      if (beer.reviews[i]["_id"] == req.params.review) {
        beer.reviews.splice(i, 1);
        beer.save();

        res.status(204);
        res.end();
      }
    }
  });
});

passport.serializeUser(function (user, done) {
  user = {
    username: user.username,
    _id: user._id
  };

  done(null, user);
});

passport.deserializeUser(function (user, done) {
  user = {
    username: user.username,
    _id: user._id
  };

  done(null, user);
});

var LocalStrategy = require('passport-local').Strategy;

// instance of register local strategy
passport.use('register', new LocalStrategy(function (username, password, done) {
  User.findOne({ 'username': username }, function (err, user) {
    // In case of any error return
    if (err) {
      console.log('Error in SignUp: ' + err);
      return done(err);
    }

    // already exists
    if (user) {
      console.log('User already exists');
      return done(null, false);
    } else {
      // if there is no user with that matches
      // create the user
      var newUser = new User();

      // set the user's local credentials
      newUser.username = username;
      newUser.password = password;    // Note: Should create a hash out of this plain password!

      // save the user
      newUser.save(function (err) {
        if (err) {
          console.log('Error in Saving user: ' + err);
          throw err;
        }

        console.log('User Registration successful');
        return done(null, newUser);
      });
    }
  });
}));

// instance of login local strategy
passport.use('login', new LocalStrategy(function (username, password, done) {
   User.findOne({ 'username': username }, function (err, user) {
     // In case of any error return
     if (err) {
       console.log('Error in Logging in: ' + err);
       return done(err);
     }

     // wrong user object
     if (!user) {
       console.log('Wrong user');
       return done(null, false);
     }

     // wrong user password
     if (password !== user.password) {
       console.log('Wrong password');
       return done(null, false);
     }

     // existsting user
     console.log('Existing user login');
     return done(null, user);

  });
}));

//register route
app.post('/register', passport.authenticate('register'), function(req, res) {
 res.json(req.user);
});

// send the current user back!
app.get('/currentUser', function (req, res) {
 res.send(req.user);
});

//login route
app.post('/login', passport.authenticate('login'), function(req, res) {
 res.json(req.user);
});

// logout route
app.get('/logout', function(req, res){
 req.logout();
 console.log("Logged out!")
 res.redirect('/');
});


app.listen(8000);