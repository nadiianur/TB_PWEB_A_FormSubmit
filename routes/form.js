const express = require('express');
const cookieParser =  require('cookie-parser');
require("dotenv").config();
const controllers = require('../controllers/formControllers.js')

var router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());


//menampilkan home
router.get('/home', controllers.home);

//read data my form
router.get('/listForm', controllers.listForm);
router.get('/listMyForm', controllers.getListMyForm);

//add form
router.post('/addform', controllers.addForm);
router.get('/addForm', controllers.getAddForm);

//edit form
router.get('/editForm/:form_id', controllers.getEditForm);
router.post('/editForm/:form_id', controllers.testEdit);

//delete form
router.delete('/deleteForm/:form_id/user/:user_id', controllers.deleteForm);

//read data submission my form
router.get('/submissionForm/:form_id', controllers.getFormSubmission);
router.get('/submissionMyForm/:form_id', controllers.FormSubmission);

module.exports = router;
