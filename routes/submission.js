const express = require('express');
const controllers = require("../controllers/submissionControllers.js")
const cookieParser =  require('cookie-parser');
require("dotenv").config();

const router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());


router.get('/upload/:form_id', controllers.getUpload);
router.post('/upload/:form_id', controllers.addSubmission);

router.get('/list', controllers.getSubmission);

router.post('/:id/:form_id/editsubmission', controllers.editSubmission);
router.post('/:id/deletesubmission', controllers.deleteSubmission);

router.get('/detailSubmission', controllers.getDetailSubmission);


module.exports = router;
