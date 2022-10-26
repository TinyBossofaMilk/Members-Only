var express = require('express');
var router = express.Router();
// const passport = require("passport");

// Require our controllers.
const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');



//routes
router.get('/', userController.home_get);

router.get("/sign-up", userController.sign_up_get);

router.post("/sign-up", userController.sign_up_post);

router.get("/log-in", userController.log_in_get);

router.post("/log-in", userController.log_in_post);

router.get("/log-out", userController.log_out_get);

router.get("/membership-form", userController.membership_get);

router.post("/membership-form", userController.membership_post);

router.get("/messages", messageController.messages_get)

router.get("/message-form", messageController.message_form_get)

router.post("/message-form", messageController.message_form_post)

router.post("/messages", messageController.message_delete_post)

module.exports = router;