var express = require('express');
const Form = require("../models/forms.js");
const user = require("../models/users.js");
const Submission = require("../models/submissions.js")
var jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require('moment');
const controllers = {}


const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    //   console.log(token)
    if (!token) {
        res.json({
            msg: "Invalid token"
        })
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user_id;
        next();
    } catch (error) {
        return res.redirect('/auth/login');
    }
};


//Tampilan Home
const home = async (req, res) => {
    // const form_id = req.params.form_id;
    try {
        const findUser = await user.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        const formCount = await Form.count();

        if (!findUser) {
            res.render('/auth/login')
        } else {
            const findForm = await Form.findAll()

            if (findForm) {
                const data = []
                for (let index = 0; index < findForm.length; index++) {
                    const user_id = findForm[index].user_id
                    const deadlines = findForm[index].deadline
                    const form_id = findForm[index].form_id
                    const tittle = findForm[index].tittle
                    const description = findForm[index].description

                    const deadline = moment(deadlines).format('YYYY/MM/DD HH:mm:ss');

                    const findUser = await user.findByPk(user_id)

                    if (findUser) {
                        const nama = findUser.nama

                        data.push({
                            nama,
                            user_id,
                            deadline,
                            form_id,
                            tittle,
                            description
                        })

                    } else {
                        res.status(400).json({
                            success: false,
                            msg: 'User not found'
                        })
                    }
                }
                res.render('home', {
                    data,
                    formCount
                });
            } else {
                res.status(400).json({
                    success: false,
                    msg: 'Form Tidak Ditemukan'
                })
            }
        }
    } catch (error) {
        return res.redirect('/auth/login');
    }
}
controllers.home = [verifyToken, home]


// Function Read Data Form
// ini buat get halaman list form yang pernah di buat si user yang login
const getListMyForm = async (req, res) => {
    try {
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
            const formPromises = allMyForm.map(async (doc) => {

                const deadlines = new Date(doc.deadline);
                const day = String(deadlines.getDate()).padStart(2, '0');
                const month = String(deadlines.getMonth() + 1).padStart(2, '0');
                const year = deadlines.getFullYear();
                const hours = String(deadlines.getHours()).padStart(2, '0');
                const minutes = String(deadlines.getMinutes()).padStart(2, '0');
                const seconds = String(deadlines.getSeconds()).padStart(2, '0');

                const format = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

                return {
                    form_id: doc.form_id,
                    tittle: doc.tittle,
                    deadline: format,
                    description: doc.description,
                    user_id: doc.user_id,
                }

            });
            const forms = await Promise.all(formPromises);
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
    try {
        const findUser = await user.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        if (!findUser) {
            return res.redirect('/auth/login')
        }

        res.render('formTask/addForm')
    } catch (error) {
        return res.redirect('/auth/login');
    }
}
controllers.getAddForm = [verifyToken, getAddForm];
// Ini untuk add form
const addForm = async (req, res) => {
    const user_id = req.session.user_id;
    const {
        tittle,
        description,
        deadline
    } = req.body;
    try {
        await Form.create({
            user_id: user_id,
            tittle: tittle,
            description: description,
            deadline: deadline
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
controllers.addForm = [verifyToken, addForm];


// Function Update Form
// Ini buat get halaman edit Form
const getEditForm = async (req, res) => {
    const form_id = req.params.form_id;

    try {
        const findUser = await user.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        const forms = await Form.findByPk(form_id);
        const tittle = forms.tittle
        const description = forms.description
        const deadline = forms.deadline

        if (!findUser) {
            res.render('/auth/login')
        } else {
            res.render('formTask/editForm', {
                form_id,
                tittle,
                description,
                deadline: formatDeadline(deadline)
            })
        }
    } catch (error) {
        return res.redirect('/auth/login');
    }

}
// untuk format deadline
function formatDeadline(deadline) {
    const date = new Date(deadline);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
controllers.getEditForm = [verifyToken, getEditForm];
// Ini buat data form yang akan di edit 
const testEdit = async (req, res) => {
    const form_id = req.params.form_id;
    console.log(form_id)

    const tittle = req.body.tittle
    const description = req.body.description
    const deadline = req.body.deadline
    const findForm = await Form.findByPk(form_id)

    if (findForm) {
        const edit = await Form.update({
            tittle: tittle,
            description: description,
            deadline: deadline
        }, {
            where: {
                form_id: form_id
            }
        })

        if (edit) {
            res.status(200).json({
                msg: 'Form Sucessfully Updated',
                data: {
                    tittle: tittle,
                    description: description,
                    deadline: deadline
                },
                success: true
            })
        } else {
            res.status(400).json({
                msg: 'Please try again',
                success: false
            })
        }
    }

}
controllers.testEdit = [verifyToken, testEdit];


// Function Read Data Submission di Form yang di buat user
// ini buat get halaman list submission form si user yg sedang login
const getFormSubmission = async (req, res) => {
    const form_id = req.params.form_id;

    try {
        const findUser = await user.findOne({
            where: {
                user_id: req.session.user_id
            }
        })

        if (!findUser) {
            res.render('/auth/login')
        }

        const form = await Form.findByPk(form_id);
        if (!form) {
            return res.status(404).json({
                success: false,
                msg: 'Form not found'
            });
        } else {
            res.render('submission/detailSubmission', {
                form_id: form_id
            });
        }

    } catch (error) {
        return res.redirect('/auth/login');
    }
}
controllers.getFormSubmission = [verifyToken, getFormSubmission];
// ini buat read data list submission form
const FormSubmission = async (req, res) => {
    const form_id = req.params.form_id

    try {
        const form = await Form.findByPk(form_id)

        if (form) {
            const submissionsForm = await Submission.findAll({
                where: {
                    form_id: form_id
                }
            })

            if (submissionsForm.length > 0) {
                const submissionPromises = submissionsForm.map(async (doc) => {
                    const User = await user.findByPk(doc.user_id);
                    const nama = User.nama;

                    const createdAt = new Date(doc.created_at);
                    const day = String(createdAt.getDate()).padStart(2, '0');
                    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
                    const year = createdAt.getFullYear();
                    const hours = String(createdAt.getHours()).padStart(2, '0');
                    const minutes = String(createdAt.getMinutes()).padStart(2, '0');
                    const seconds = String(createdAt.getSeconds()).padStart(2, '0');

                    const format = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

                    return {
                        id: doc.id,
                        user_id: doc.user_id,
                        form_id: doc.form_id,
                        uploaded_file: doc.uploaded_file,
                        created_at: format,
                        description: doc.description,
                        updated_at: doc.updated_at,
                        status: doc.status,
                        nama: nama,
                    };
                });

                const submissions = await Promise.all(submissionPromises);

                res.status(200).json({
                    success: true,
                    submissions: submissions
                });
            } else {
                res.status(400).json({
                    success: false,
                    msg: 'Doesnt have any submission in this form'
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: 'eror',
            msg: 'Server error',
        });
    }

}
controllers.FormSubmission = [verifyToken, FormSubmission];


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