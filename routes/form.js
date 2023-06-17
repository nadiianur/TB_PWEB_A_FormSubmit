const express = require('express');
const cookieParser =  require('cookie-parser');
require("dotenv").config();
var verifyToken = require("../middleware/verifyToken.js");
const controllers = require('../controllers/formControllers.js')

var router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());

router.get('/listForm', controllers.listForm);
router.get('/upload/:form_id', controllers.thisForm)
router.get('/listMyForm', controllers.getListMyForm);

router.post('/addform', controllers.addForm);
router.get('/addForm', controllers.getAddForm);

router.get('/editForm/:form_id', controllers.getEditForm);
router.put('/editForm/:form_id', controllers.editForm);

router.delete('/deleteForm/:form_id/user/:user_id', controllers.deleteForm);
router.get('/home', controllers.home);


router.get('/formSubmission', controllers.getFormSubmission);


module.exports = router;
