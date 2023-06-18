var express = require('express');
const Form = require("../models/forms.js");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const user = require('../models/users.js');
const moment = require('moment');
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

const home = async (req, res) => {
    const findForm = await Form.findAll()
    
    if (findForm) {
        const data = []
        for (let index = 0; index < findForm.length; index++) {
            const user_id = findForm[index].user_id
            const created = findForm[index].created_at
            const form_id = findForm[index].form_id
            const tittle = findForm[index].tittle
            const description = findForm[index].description

            const created_at = moment(created).format('YYYY-MM-DD HH:mm:ss');

            const findUser = await user.findByPk(user_id)

            if (findUser) {
                const nama = findUser.nama

                data.push({
                    nama, user_id, created_at, form_id, tittle, description
                })
                
            } else {
                res.status(400).json ({
                    success: false,
                    msg: 'Pengguna Tidak Ditemukan'
                })
            }
        }
        res.render('home',{
            data
        });
    } else {
        res.status(400).json({
            success:false,
            msg: 'Form Tidak Ditemukan'
        })
    }
    
}
controllers.home = [verifyToken, home]

const thisForm = async (req, res) => {
    // const form_id = req.params.form_id
    // const tittle = req.params.tittle
    // const user_id = req.params.user_id
    // const created_at = req.params.created_at
    // const description = req.params.description

    // if(!form_id){
    //     res.status(400).json({
    //         success: false,
    //         msg: 'Data Tidak Didapatkan'
    //     })
    // } else {
    //     const findForm = Form.findOne({
    //         where:{
    //             form_id: form_id 
    //         }
    //     })
    //     if (findForm) {
    //        res.sender('submission/upload', {
    //         form_id, tittle, user_id, created_at, description
    //        })
    //     }
    // }
  }

controllers.thisForm = [verifyToken,thisForm];


const getFormSubmission = (req, res) => {
    res.render('submission/listSubmission');
}
controllers.getFormSubmission = [verifyToken, getFormSubmission];


// Function Read Data Form
// ini buat get halaman list form yang pernah di buat si user yang login
const getListMyForm = async (req, res) => 
{
    try{
        const findUser = await user.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        if (!findUser) {
            res.render('/auth/login')
        }

        res.render('formTask/listMyForm')
    } catch (error) {
        return res.redirect('/auth/login');
    }
};  
controllers.getListMyForm = [verifyToken, getListMyForm];

// ini buat read data form si user yg lagi login
const listForm = async (req, res) => {
    try {
        const allMyForm = await Form.findAll({
          where: {
            user_id: req.session.user_id
          }
        });
    
        if (allMyForm.length > 0) {
            const forms = allMyForm.map((doc) => ({
                form_id: doc.form_id,
                tittle: doc.tittle,
                created_at: doc.created_at,
                description: doc.description,
                user_id: doc.user_id,
            }));
          res.status(200).json({
            success: true,
            forms: forms
          });
        } else {
          res.status(400).json({
            success: false,
            msg: 'You dont have any form'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          msg: 'Try Again!'
        });
      }
    };
controllers.listForm = [verifyToken, listForm];


// Function Create Form
// Ini buat get halaman add Form
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

// Ini buat data yang untuk add form
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


// Function Update Form
// Ini buat get halaman edit Form
const getEditForm = async (req, res) => {
    const form_id = req.params.form_id;
    
    const findUser = await user.findOne({
        where: {
            user_id: req.session.user_id
        }
    })

    const forms = await Form.findByPk(form_id);
    const tittle = forms.tittle
    const description = forms.description

    if (!findUser) {
        res.render('/auth/login')
    } else {
        res.render('formTask/editForm', {
          form_id,
          tittle,
          description
        })
    }
}
controllers.getEditForm = [verifyToken, getEditForm];
// Ini buat data form yang akan di edit 
const testEdit = async (req, res) => {
    const form_id = req.params.form_id;
    console.log(form_id)

    const tittle = req.body.tittle
    const description = req.body.description
    const findForm = await Form.findByPk(form_id)

    if(findForm){
        const edit = await Form.update({
            tittle: tittle,
            description:  description
        },{
            where:{
                form_id: form_id
            }
        })

        if(edit){
            res.status(200).json({
                msg: 'Form Sucessfully Updated',
                data: {
                    tittle: tittle,
                    description:description
                },
                success: true
            })
        } else{
            res.status(400).json({
                msg: 'Please try again',
                success: false
            })
        }
    }
        
}
controllers.testEdit = testEdit;


// Function Dalete Form
const deleteForm = async (req, res) => {
    const form_id = req.params.form_id;
    const user_id = req.params.user_id;

    const delet = await Form.destroy({
        where: {
          form_id: form_id,
          user_id: user_id
        }
    });
    if (delet) {
        res.status(200).json({
            success: true,
            msg: 'Form sucessfully deleted'
          })
    } else {
        res.status(400).json({
            success: false,
            msg: 'Please try again!'
          })
    }
}
controllers.deleteForm = [verifyToken, deleteForm];

module.exports = controllers