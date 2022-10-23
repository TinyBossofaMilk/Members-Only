var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
const passport = require('passport');

const User = require("../models/user");


exports.home_get = (req, res) => res.render("home", {user: res.locals.currentUser});

exports.sign_up_get = (req, res) => {
  //if already logged in, redirects you to the home.
  if(res.locals.currentUser) {
    return res.redirect("/");
  };

  res.render("sign-up");
}

exports.sign_up_post = [
  body("firstName").trim().isLength({min:1}).withMessage("First name must not be empty"),
  body("lastName").trim().isLength({min:1}).withMessage("Last name must not be empty"),
  body("email").trim().isLength({min:1}).withMessage("Email must not be empty"),
  body("password").trim().isLength({min:1}).withMessage("Email must not be empty"),
  body("confirmPassword").custom((value, {req}) => {
    if(value !== req.body.password) throw new Error('passwords need to match');
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log("ERROR!")
      res.render("sign-up", {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        errors: errors.array(),
      })
      return;
    }
    
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if(err) throw new Error("password hashing error");
      
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        member: false,
        admin: false,
      }).save(err => err ? next(err) : res.redirect("/"));
    })
  }
];

exports.log_in_get = (req, res) => {
    //if already logged in, redirects you to the home.
    if(res.locals.currentUser) { 
      return res.redirect("/");
    };

    res.render("log-in");
}

exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/messages",
    failureRedirect: "/log-in"
});

exports.log_out_get = (req, res, next) => {
  req.logout(function (err) {
      if (err) {
      return next(err);
      }
  res.redirect("/");
  });
};

exports.membership_get = (req, res, next) => {
  res.render("membership-form");
};

exports.membership_post = [
  body("password").isLength({min:1}).withMessage("Password must not be empty")
    .custom((value, {req}) => {return value === "true";}).withMessage("Incorrect password"),

  (req, res, next) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log("failed")
      res.render("membership-form", {error:["Incorrect password"]});
      return;
    }
    else{
      console.log("worked");
      User.findOneAndUpdate({_id:res.locals.currentUser._id}, {member: true})
      res.redirect("/messages")
    }

    // if(res.body.password === "true") {
    //   console.log("here")
      // User.findbyId(res.locals.currentUser._id).exec(
      //   (err, user => {
      //     if(err) return next(err);
          
      //     res.redirect('messages')
      //   })
      // )
  }
]

exports.getHashedPasswordFor = async password => {
  const result = await bcrypt.hash(password, 10)
    .then(hashedPassword => ({ hashedPassword }))
    .catch(error => ({ error }));
  if (result.error) throw result.error;

  return result.hashedPassword;
};
