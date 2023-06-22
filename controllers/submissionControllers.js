var express = require('express');
const Submission = require("../models/submissions.js");
const Form = require("../models/forms.js");
const User = require("../models/users.js");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const req = require('express/lib/request.js');
// const { title } = require('process');
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
        req.User = decoded.user_id;
        next();
    } catch (error) {
        // Token tidak valid atau kedaluwarsa, redirect ke halaman login
        return res.redirect('/auth/login');
    }
};


// Function Create Submission
// Ini buat get halaman add Submission
const getUpload= async (req, res) => {
    const form_id = req.params.form_id;
    
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
    
    const cekSubmission = await Submission.findOne({
        where:{
            user_id: findUser.user_id,
            form_id: findForm.form_id
        }
    })

    if(!cekSubmission){
        //jika belum pernah upload
        res.render('submission/upload', {
            item: item,
            user: findUser,
            uploaded_file: null,
            description: null,
        })
    } else {
        res.render('submission/upload', {
            item: item,
            user: findUser,
            id: cekSubmission.id,
            user_id: cekSubmission.user_id,
            uploaded_file: cekSubmission.uploaded_file,
            description: cekSubmission.description
            })
    }
    }
controllers.getUpload = [verifyToken, getUpload];

// Konfigurasi modul multer untuk uploaded file
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

// Ini untuk add Submission
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
                success: true,
                data: {
                    user_id: user_id,
                    form_id: form_id,
                    uploaded_file: file.originalname,
                    description: description,
                }
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


// Function Update Submission
// Ini buat get halaman edit Submission
const getEdit= async (req, res) => {
    const id = req.params.id
    const user_id =req.session.user_id

    const findSubmit = await Submission.findOne({
        where:{
            id: id
        }
    })

    const findForm = await Form.findOne({
        where:{
            form_id: findSubmit.form_id 
        }
    })
    
    const findUser = await User.findOne({
        where : {
            user_id: findSubmit.user_id
        }
    })

    if (!findUser) {
        res.render('/auth/login')
    } else {
        res.render('submission/editSubmission', {
            item: findSubmit,
            user: findUser,
            form: findForm,
            user_id,
            id,
            success: true
        })
    } 
}
controllers.getEdit = [verifyToken, getEdit];
// Ini buat submission data yang akan di edit
//Hanya menyediakan editan untuk description
const editSubmission = async (req, res) => {
    const id = req.params.id;

    try {
        const description  = req.body.description;
        const findSubmission = await Submission.findByPk(id)

        if (!findSubmission){
            res.status(400).json({
                msg: 'Submission not find',
                success: "undefined"
              })
        } else {
            const updateSubmit = await Submission.update({
                description: description
            },
            {
                where: {
                    id: id
                }
            })

            if (updateSubmit) {
                res.status(200).json({
                    msg: "File already updated!",
                    data: {
                        description: description
                      },
                      success: true
                })
            } else {
                res.status(400).json({
                    msg: "Please try again later",
                    success: false
                })
            }
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.editSubmission = [verifyToken, editSubmission];


// Function Read Data Submission
// ini buat get halaman list submission
const getListMySubmission = async (req, res) => 
{
    try{
        const findUser = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        if (!findUser) {
            res.render('/auth/login')
        }

        res.render('submission/listSubmission')
    } catch (error) {
        return res.redirect('/auth/login');
    }
};  
controllers.getListMySubmission = [verifyToken, getListMySubmission];
// ini buat read data Submission si user yg lagi login
const listSubmission = async(req,res) => {
    try {
        const allMySubmission = await Submission.findAll({
          where: {
            user_id: req.session.user_id
          }
        });
        
        if (allMySubmission.length > 0) {
          const submissions = allMySubmission.map((doc) => ({
            id: doc.id,
            user_id: doc.user_id,
            form_id: doc.form_id,
            uploaded_file: doc.uploaded_file,
            created_at: doc.created_at,
            description: doc.description,
            updated_at: doc.updated_at,  
          }));

          res.status(200).json({
            success: true,
            submissions: submissions
          });
        } else {
          res.status(400).json({
            success: false,
            msg: 'Nothing your submission'
          });
        }
      } catch (error) {
        res.status(500).json({
          msg: 'Try Again!',
          success: 'error'
        });
      }
    };
controllers.listSubmission = [verifyToken, listSubmission];


// Function Dalete Submission
const deleteSubmission = async (req, res) => {
    const id = req.params.id;
    try {
        const delet = await Submission.destroy({
            where: {
              id: id,
            }
        });
        if (delet) {
            res.status(200).json({
                success: true,
                msg: 'Submission sucessfully deleted'
              })
        } else {
            res.status(400).json({
                success: false,
                msg: 'Please try again!'
              })
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.deleteSubmission = [verifyToken, deleteSubmission];


const downloadSubmission = async (req, res) => {
    const id = req.params.id;

    try {
        const file = await Submission.findByPk(id)

        if (!file) {
            res.status(404).json({
                success: false,
                msg: 'Submission not found',
              });
        }
        
        //atribute file upload
        const filePath = path.join(__dirname,  '../', 'assets', 'fileSubmit', file.uploaded_file);

        //periksa file ada atau tidak
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
              success: 'no',
              msg: 'File not found',
            });
          }

        // Mengirim file sebagai respons download
        res.download(filePath);

    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.downloadSubmission = [verifyToken, downloadSubmission];

module.exports = controllers;
