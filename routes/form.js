const express = require('express');
const cookieParser =  require('cookie-parser');
require("dotenv").config();
var verifyToken = require("../middleware/verifyToken.js");
const controllers = require('../controllers/formControllers.js')

var router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());

router.get('/list', controllers.listForm);
router.post('/addform', controllers.addForm);
router.post('/:form_id/editform', controllers.editForm);
router.post('/:form_id/deleteform', controllers.deleteForm);
router.get('/home', controllers.home);
router.get('/addForm', controllers.getAddForm);
router.get('/editForm', controllers.getEditForm);
router.get('/listMyForm', controllers.getListMyForm);
router.get('/formSubmission', controllers.getFormSubmission);

module.exports = router;
