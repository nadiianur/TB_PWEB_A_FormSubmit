var express = require('express');
const Form = require("../models/forms.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var bodyParser = require('body-parser');
require("dotenv").config();
const user = require('../models/users.js');
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

const listForm = async (req, res) => {

}
controllers.listForm = [verifyToken, listForm];

const getListMyForm = async (req, res) => {
    res.render('formTask/listMyForm');
}
controllers.getListMyForm = [verifyToken, getListMyForm];


const home = async (req, res) => {
    res.render('home');
}
controllers.home = [verifyToken, home]


const getFormSubmission = (req, res) => {
    res.render('submission/listSubmission');
}
controllers.getFormSubmission = [verifyToken, getFormSubmission];

const addForm = async (req, res) => {
    const user_id = req.session.user_id;
    const {
        tittle,
        description
    } = req.body;
    try {
        await Form.create({
            user_id: user_id,
            tittle: tittle,
            description: description
        })
        if (Form) {
            res.json({
                msg: "Form Succesfully Added!",
                success: 'ok'
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
controllers.addForm = addForm;

const getAddForm = async (req, res) => {
    try{
        const findUser = await user.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        if (!findUser){
            return res.redirect('/auth/login')
        }

        res.render('formTask/addForm')
    } catch (error) {
        return res.redirect('/auth/login');
      }
}
controllers.getAddForm = [verifyToken, getAddForm];

const editForm = async (req, res) => {
    let form_id = req.params.form_id;
    // let user_id = req.params.user_id;
    const {
        tittle,
        description
    } = req.body;
    try {
        await Form.update({
            tittle: tittle,
            description: description,
        }, {
            where: {
                form_id: form_id
                // user_id : user_id
            }
        })
        if (Form) {
            res.json({
                msg: "Form already updated!"
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
controllers.editForm = editForm;

const getEditForm = (req, res) => {
    res.render('formTask/editForm');
}
controllers.getEditForm = getEditForm;

const deleteForm = async (req, res) => {
    let form_id = req.params.form_id;
    // let user_id = req.params.user_id;
    try {
        await Form.destroy({
            where: {
                form_id: form_id
                // user_id : user_id
            }
        })
        if (Form) {
            res.json({
                msg: "Form succesfully deleted!"
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
controllers.deleteForm = deleteForm;

module.exports = controllers