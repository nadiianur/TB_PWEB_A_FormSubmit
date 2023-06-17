const express = require('express');
const controllers = require("../controllers/submissionControllers.js")
const cookieParser =  require('cookie-parser');
var verifyToken = require("../middleware/verifyToken.js");
require("dotenv").config();

const router = express.Router();

router.use(express.static('public'));
router.use(express.json()); 
router.use(cookieParser());


router.get('/upload/:form_id', controllers.uploadSubmission);

router.get('/list', controllers.getSubmission, verifyToken);
router.post('/addsubmission', controllers.addSubmission, verifyToken);
router.post('/:id/:form_id/editsubmission', controllers.editSubmission, verifyToken);
router.post('/:id/deletesubmission', controllers.deleteSubmission, verifyToken);

router.get('/detailSubmission', controllers.getDetailSubmission);


module.exports = router;
