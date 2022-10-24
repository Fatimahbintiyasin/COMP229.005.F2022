// File Name: user.js
// Student Name: Fatimah Binti Yasin
// Student ID:  301193282
// Date: Oct 24, 2022


let User = require('../models/user');
let passport = require('passport');

function getErrorMessage(err) {
  console.log("===> Error: " + err);
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

module.exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('auth/signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    console.log(req.user);
    return res.redirect('/business/list');
  }
};

module.exports.renderSignup = function(req, res, next) {
  if (!req.user) {

    // creates a empty new user object.
    let newUser = User();

    res.render('auth/signup', {
      title: 'Sign-up Form',
      messages: req.flash('error'),
      user: newUser
    });

  } else {
    return res.redirect('/business/list');
  }
};

module.exports.signup = function(req, res, next) {
  if (!req.user && req.body.password === req.body.confirmPass) {
    console.log(req.body);

    let user = new User(req.body);
    user.provider = 'local';
    console.log(user);

    user.save((err) => {
      if (err) {
        let message = getErrorMessage(err);

        req.flash('error', message);
        // return res.redirect('/users/signup');
        return res.render('auth/signup', {
          title: 'Sign-up Form',
          messages: req.flash('error'),
          user: user
        });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect('/business/list');
      });
    });
  } else {
    return res.redirect('/business/list');
  }
};

module.exports.signout = function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/users/signin');
  });
};

module.exports.signin = function(req, res, next){
  passport.authenticate('local', {   
    successRedirect: req.session.url || '/business/list',
    failureRedirect: '/users/signin',
    failureFlash: true
  })(req, res, next);
  delete req.session.url;
}
exports.user = function (req, res, next) {
  res.render('users', {
      title: 'User',
      userName: req.user ? req.user.username : '',
  });
}
