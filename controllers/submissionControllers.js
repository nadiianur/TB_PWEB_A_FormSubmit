var express = require('express');
const Submission = require("../models/submissions.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var bodyParser = require('body-parser');
require("dotenv").config();
const controllers = {}

const getSubmission = async (req, res) => {
    const submission = await Submission.findAll();
    res.json(submission)
}
controllers.getSubmission = getSubmission;

const uploadSubmission = (req, res) => {
    res.render('submission/upload');
  }
controllers.uploadSubmission = uploadSubmission;

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
