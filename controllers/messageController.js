var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var async = require('async');


const Message = require("../models/message");
const User = require("../models/user")

exports.messages_get = (req, res, next) => {
    async.parallel(
        {
            messages_list(callback) {
                Message.find().sort({date:1}).exec(callback);
            },
            users(callback) {
                User.find().exec(callback);
            }
        },    
        (err, results) => {
            if(err) return next(err);
            
            //change object id referencing to user to user object instead
            results.messages_list.forEach((message) => {
                let author = User.findById(message.user);
                message.user = author;
                // console.log(message.user)
                console.log(author)
            });
            
            res.render("messages", {messages_list: results.messages_list, user: res.locals.currentUser});
        }
    )
};

// async.parallel(
//     {
//         ability(callback){
//             Ability.findById(req.params.id)
//                 .exec(callback);
//         },
//         pokemon_list(callback) {
//             Pokemon.find({ability: req.params.id})
//                 .exec(callback);
//         }
//     },
//     (err, results) => {
//         if(err) return next(err);

//         if(results.ability == null) {
//             const err = new Error("Ability not found.");
//             err.status = 404;
//             return next(err);
//         }
        
//         // Successful, so render.
//         res.render("ability-detail", {
//             ability: results.ability, 
//             pokemon_list: results.pokemon_list
//         })
//     }
// )

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