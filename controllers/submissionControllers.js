var express = require('express');
const Submission = require("../models/submissions.js");
const Form = require("../models/forms.js");
const User = require("../models/users.js");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const controllers = {}


const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    //   console.log(token)
    if (!token) {
        res.json({
            msg: "Invalid token"
        })
        // Token tidak ada, redirect ke halaman login
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user_id;
        next();
    } catch (error) {
        // Token tidak valid atau kedaluwarsa, redirect ke halaman login
        return res.redirect('/auth/login');
    }
};

const getSubmission = async (req, res) => {
    const submission = await Submission.findAll();
    res.json(submission)
}
controllers.getSubmission = getSubmission;


const getUpload= async (req, res) => {
    const form_id = req.params.form_id
    // const tittle = req.params.tittle
    // const user_id = req.params.user_id
    // const created_at = req.params.created_at
    // const description = req.params.description

    const findForm = await Form.findOne({
        where:{
            form_id: form_id 
        }
    })
    
    const findUser = await User.findOne({
        where : {
            user_id: findForm.user_id
        }
    })

    const item = findForm
    if(!form_id){
        res.status(400).json({
            success: false,
            msg: 'Data Tidak Didapatkan'
        })
    }
        
    res.render('submission/upload', {
        item: item,
        user: findUser
        })
    }
controllers.getUpload = [verifyToken, getUpload];


// Konfigurasi modul multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../', 'assets', 'fileSubmit'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
})
const uploaded = upload.single('file');

const addSubmission = async (req, res) => {
    const form_id = req.params.form_id;
    const user_id =  req.session.user_id;
    const file = req.file;
    const description = req.body.description;

    try {
        
        const uploads = await Submission.create({
            user_id: user_id,
            form_id: form_id,
            uploaded_file: file.originalname,
            description: description,
        })
        if (uploads) {
            res.status(200).json({
                msg: "Successfully added submission",
                data: {
                    user_id: user_id,
                    form_id: form_id,
                    uploaded_file: file.originalname,
                    description: description,
                },
                success: true
            });
        } else {
            res.status(400).json({
                msg: "Please try again later",
                success: false
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.addSubmission = [verifyToken, uploaded, addSubmission];

const getDetailSubmission = (req, res) => {
    res.render('submission/detailSubmission');
  }
controllers.getDetailSubmission = getDetailSubmission;

const editSubmission = async (req, res) => {
    let id = req.params.id;
    let form_id = req.params.form_id;
    // let user_id = req.params.user_id;
    const { uploaded_file, description } = req.body;
    try {
        await Submission.update({
            uploaded_file: uploaded_file,
            description: description,
        }, {
            where: {
                id : id,
                form_id: form_id,
                // user_id : user_id
            }
        })
        if (Submission) {
            res.json({
                msg: "File already updated!"
            })
        } else {
            res.json({
                msg: "Please try again later"
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.editSubmission = editSubmission;

const deleteSubmission = async (req, res) => {
    let id = req.params.id;
    let form_id = req.params.form_id;
    // let user_id = req.params.user_id;
    try {
        await Submission.destroy({
            where: {
                id : id,
                form_id: form_id,
                // user_id: user_id
            }
        })
        if (Submission) {
            res.json({
                msg: "File successfully deleted!"
            })
        } else {
            res.json({
                msg: "Please try again later"
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.deleteSubmission = deleteSubmission;

module.exports = controllers;
