const express = require('express');
// const { getUsers, login , getLogin, logOut } = require("../controllers/authControllers.js")
const cookieParser =  require('cookie-parser');
require("dotenv").config();
const controllers = require('../controllers/authControllers.js')

var router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());

// router.post('/register', register);
router.get('/login', controllers.viewLogin);
router.post('/login', controllers.login);
router.get('/logout', controllers.logOut);


module.exports = router;
