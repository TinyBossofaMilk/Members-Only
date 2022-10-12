var express = require('express');
var router = express.Router();


//// app.js

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", (req, res, next) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    }).save(err => {
      if (err) { 
        return next(err);
      }
      res.redirect("/");
    });
  });