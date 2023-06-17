const express = require('express');
// const { register } = require("../controllers/userControllers.js")
var verifyToken = require("../middleware/verifyToken.js");
const cookieParser =  require('cookie-parser');
require("dotenv").config();
const controllers = require('../controllers/userControllers.js')

const router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());

router.get('/register', controllers.viewRegister)
router.post('/register', controllers.register);

router.get('/profile', controllers.getProfile)
router.get('/editProfile', controllers.getEditProfile
)
router.post('/editProfile', controllers.editUser);

module.exports = router;