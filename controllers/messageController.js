var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");

const Message = require("../models/message");

exports.messages_get = (req, res) => {
    res.render("messages", {user: res.locals.currentUser});
}

exports.message_form_get = (req, res) => {
    //if not logged in, redirect to sign in
    if(!res.locals.currentUser)
        res.redirect('/sign-up')
        
    //if not a member, redirect to membership form
    if(!res.locals.currentUser.member)
        res.redirect('/sign-up')


    res.render("message-form", {user: res.locals.currentUser});
};

exports.message_form_post = [
    body("title").trim(),
    body("text").trim().isLength({min:1}).withMessage("Message must not be empty."),

    (req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            res.render("message-form", {title: req.body.title, text: req.body.text, errors: errors.array()})
            return;
        }
        else {
            const newmsg = new Message({
                title: req.body.title,
                text: req.body.text,
                date: Date.now(),
                user: res.locals.currentUser._id
            });
            
            newmsg.save(function (err) { 
                next(err);
                res.redirect('/messages');
            })
        }
    }
]