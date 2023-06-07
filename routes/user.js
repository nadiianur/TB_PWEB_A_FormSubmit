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

router.post('/register', controllers.register);
router.get('/register', controllers.viewRegister)
router.get('/profile', controllers.getProfile, verifyToken)
router.get('/editProfile', controllers.getEditProfile, verifyToken)
router.post('/:user_id/editProfile', controllers.editUser, verifyToken);

module.exports = router;