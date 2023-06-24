const express = require('express');
// const { getUsers, login , getLogin, logOut } = require("../controllers/authControllers.js")
const cookieParser =  require('cookie-parser');
require("dotenv").config();
const controllers = require('../controllers/authControllers.js')

var router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());

//login akun
router.get('/login', controllers.viewLogin);
router.post('/login', controllers.login);

//logout akun
router.get('/logout', controllers.logOut);

//reset password akun
router.get('/resetPassword', controllers.viewResetPass);
router.post('/resetPassword', controllers.resetPass);

module.exports = router;
