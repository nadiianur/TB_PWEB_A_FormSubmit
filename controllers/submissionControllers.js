var express = require('express');
const Submission = require("../models/submissions.js");
const Form = require("../models/forms.js");
const User = require("../models/users.js");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    timeStamp
} = require('console');
// const { user } = require('accesstoken/config.js');
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
const getUpload = async (req, res) => {
    const form_id = req.params.form_id;
    const user_id = req.session.user_id;
    try {
        const findForm = await Form.findOne({
            where: {
                form_id: form_id,
            }
        })

        const findUser = await User.findOne({
            where: {
                user_id: user_id
            }
        })

        const item = findForm

        if (!form_id) {
            res.status(400).json({
                success: false,
                msg: 'Data Tidak Didapatkan'
            })
        }
        const cekSubmission = await Submission.findOne({
            where: {
                user_id: findUser.user_id,
                form_id: findForm.form_id
            }
        })

        if (!cekSubmission) {
            //jika belum pernah upload
            res.render('submission/upload', {
                item: item,
                deadline: formatTime(item.deadline),
                user: findUser,
                uploaded_file: null,
                description: null,
            })
        } else {
            res.render('submission/upload', {
                item: item,
                deadline: formatTime(item.deadline),
                user: findUser,
                id: cekSubmission.id,
                user_id: cekSubmission.user_id,
                uploaded_file: cekSubmission.uploaded_file,
                description: cekSubmission.description,
                status: cekSubmission.status
            })
        }
    } catch (error) {
        return res.redirect('/auth/login');
    }

}
// fungsi untuk menampilkan date time ke client
function formatTime(deadline) {
    const date = new Date(deadline);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
}
controllers.getUpload = [verifyToken, getUpload];

// Konfigurasi modul multer untuk uploaded file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
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
    const user_id = req.session.user_id;
    const file = req.file;
    const description = req.body.description;

    try {
        const myForm = await Form.findOne({
            where: {
                form_id: form_id,
                user_id: req.session.user_id
            }
        })
        if (myForm) {
            res.status(400).json({
                success: 'mine',
                msg: 'Cant Submit in your own Form',
            });
        } else {
            const created_at = new Date();
            const myForm = await Form.findByPk(form_id);
            const deadline = new Date(myForm.deadline);

            const status = created_at <= deadline ? 'ontime' : 'late';

            const uploads = await Submission.create({
                user_id: user_id,
                form_id: form_id,
                uploaded_file: file.originalname,
                description: description,
                status: status
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
                        status: status
                    }
                });
            } else {
                res.status(400).json({
                    msg: 'Please try again later',
                    success: false
                });
            }

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
const getEdit = async (req, res) => {
    const id = req.params.id
    const user_id = req.session.user_id

    const findSubmit = await Submission.findOne({
        where: {
            id: id
        }
    })

    const findForm = await Form.findOne({
        where: {
            form_id: findSubmit.form_id
        }
    })

    const findUser = await User.findOne({
        where: {
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
        const description = req.body.description;
        const findSubmission = await Submission.findByPk(id)

        if (!findSubmission) {
            res.status(400).json({
                msg: 'Submission not find',
                success: "undefined"
            })
        } else {
            const updateSubmit = await Submission.update({
                description: description
            }, {
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
const getListMySubmission = async (req, res) => {
    try {
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
const listSubmission = async (req, res) => {
    try {
        const allMySubmission = await Submission.findAll({
            where: {
                user_id: req.session.user_id
            }
        });

        if (allMySubmission.length > 0) {
            const submissionPromises = allMySubmission.map(async (doc) => {
                const findForm = await Form.findByPk(doc.form_id)
                const tittle = findForm.tittle;

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
                    tittle: tittle,
                    uploaded_file: doc.uploaded_file,
                    created_at: format,
                    description: doc.description,
                    updated_at: doc.updated_at,
                    status: doc.status,
                }
            });
            const submissions = await Promise.all(submissionPromises);
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


// Download File Submission
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

        //atribute file 
        const filePath = path.join(__dirname, '../', 'assets', 'fileSubmit', file.uploaded_file);

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


// Lihat File Submission
const lihatFileSubmission = async (req, res) => {
    const id = req.params.id

    try {
        const file = await Submission.findByPk(id)

        //atribute file
        const filePath = path.join(__dirname, '../', 'assets', 'fileSubmit', file.uploaded_file);

        res.sendFile(filePath, {
            success: true
        });

    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({
            success: false,
            msg: 'Failed to fetch submission'
        });
    }
};
controllers.lihatFileSubmission = [verifyToken, lihatFileSubmission];

module.exports = controllers;