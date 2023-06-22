const express = require('express');
const cookieParser =  require('cookie-parser');
require("dotenv").config();
const controllers = require('../controllers/formControllers.js')

var router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());

router.get('/home', controllers.home);

router.get('/listForm', controllers.listForm);
router.get('/listMyForm', controllers.getListMyForm);

router.post('/addform', controllers.addForm);
router.get('/addForm', controllers.getAddForm);

router.get('/editForm/:form_id', controllers.getEditForm);
router.post('/editForm/:form_id', controllers.testEdit);

router.delete('/deleteForm/:form_id/user/:user_id', controllers.deleteForm);

router.get('/submissionForm/:form_id', controllers.getFormSubmission);
router.get('/submissionMyForm/:form_id', controllers.FormSubmission);

module.exports = router;
