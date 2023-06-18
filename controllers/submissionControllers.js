var express = require('express');
const Submission = require("../models/submissions.js");
const Form = require("../models/forms.js");
const User = require("../models/users.js");
var jwt = require("jsonwebtoken");
require("dotenv").config();
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

const uploadSubmission = async (req, res) => {
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
controllers.uploadSubmission = [verifyToken, uploadSubmission];

const getDetailSubmission = (req, res) => {
    res.render('submission/detailSubmission');
  }
controllers.getDetailSubmission = getDetailSubmission;

const addSubmission = async (req, res) => {
    const { user_id, form_id, uploaded_file,description } = req.body;
    try {
        await Submission.create({
            user_id: user_id,
            form_id: form_id,
            uploaded_file: uploaded_file,
            description: description,
    })
        if (Submission) {
            res.json({ msg: "Successfully added submission" })
        } 
        else {
            res.json({
                message: "Please try again later"
            })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.addSubmission = addSubmission;

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
