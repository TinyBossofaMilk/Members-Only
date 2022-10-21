var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");

const Message = require("../models/message");

exports.messages_get = (req, res) => res.render("messages");