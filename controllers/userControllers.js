const User = require("../models/users.js");
const bcrypt = require("bcrypt");
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
        req.User = decoded.user_id;
        next();
    } catch (error) {
        // Token tidak valid atau kedaluwarsa, redirect ke halaman login
        return res.redirect('/auth/login');
    }
};


// Function Register Akun
// ini buat post semua data user yang melakukan register
const register = async (req, res) => {
    const {
        nama,
        username,
        email,
        password,
        confPassword
    } = req.body;
    if (password !== confPassword)
        return res.status(400).json({
            msg: "Password doesnt match",
            success: 'failedPassword'
        });

    try {
        const userExists = await User.findOne({
            where: {
                username
            }
        });
        if (userExists) {
            res.status(400).json({
                msg: 'Username already exists',
                success: false
            });
            return;
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            nama: nama,
            username: username,
            email: email,
            password: hashPassword,
            active: '1',
            avatar: 'picture'
        });
        if (user) {
            res.json({
                msg: "Register Successfully!",
                success: 'true'
            })
        } else {
            res.json({
                msg: 'Register Failed'
            });
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
}
controllers.register = register
// ini buat get halaman register akun
const viewRegister = async (req, res) => {
    res.render('signup');
}
controllers.viewRegister = viewRegister


// Function Read Data Profile
// ini buat get halaman profile si user yang login
const getProfile = async (req, res) => {
    try {
        const findUser = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        });

        if (!findUser) {
            return res.redirect('/auth/login');
        }
        const nama = findUser.nama
        const username = findUser.username;
        const email = findUser.email

        res.render('profile', {
            nama,
            username,
            email,
        });
    } catch (error) {
        return res.redirect('/auth/login');
    }
}
controllers.getProfile = [verifyToken, getProfile];


// Function Edit Data Profile
// ini buat get halaman edit profile si user yang login
const getEditProfile = async (req, res) => {
    try {
        const findUser = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        });

        if (!findUser) {
            return res.redirect('/auth/login');
        }
        const nama = findUser.nama
        const username = findUser.username;
        const email = findUser.email

        res.render('editProfile', {
            nama,
            username,
            email,
        });
    } catch (error) {
        return res.redirect('/auth/login');
    }
}
controllers.getEditProfile = [verifyToken, getEditProfile];
// ini buat post data edit profile
const editUser = async (req, res) => {
    try {
        const findUser = await User.findOne({
            where: {
                user_id: req.session.user_id
            }
        });

        const {
            username,
            email,
            nama,
            passwordBaru,
            passwordLama
        } = req.body;
        const user_id = findUser.user_id;
        const passwordAsli = findUser.password;

        if (!username || !email || !nama) {
            return res.status(400).json({
                success: false,
                msg: 'Data not valid'
            });
        }

        if (username.length < 8) {
            return res.status(400).json({
                success: false,
                msg: 'Username must be at least 8 characters'
            });
        }

        if (passwordBaru && !passwordLama) {
            return res.status(400).json({
                success: false,
                msg: 'Please fill in Old Password'
            });
        }

        if (!passwordBaru && passwordLama) {
            return res.status(400).json({
                success: false,
                msg: 'Please fill in New Password'
            });
        }

        if (passwordBaru && passwordLama) {
            const salt = bcrypt.genSaltSync(10);
            const passwordMatch = bcrypt.compareSync(passwordLama, passwordAsli);

            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    msg: 'Wrong Old Password'
                });
            }

            const hashedPasswordBaru = bcrypt.hashSync(passwordBaru, salt);
            await User.update({
                username: username,
                password: hashedPasswordBaru,
                email: email,
                nama: nama,
            }, {
                where: {
                    user_id: user_id
                }
            });
        } else {
            await User.update({
                username: username,
                email: email,
                nama: nama,
            }, {
                where: {
                    user_id: user_id
                }
            });
        }

        const findUserBaru = await User.findByPk(user_id);
        const newUsername = findUserBaru.username;
        const newEmail = findUserBaru.email;
        const newNama = findUserBaru.nama;

        res.status(200).json({
            success: true,
            username: newUsername,
            email: newEmail,
            nama: newNama,
            msg: 'Profile Successfully Updated'
        });
    } catch (error) {
        return res.redirect('/auth/login');
    }
};
controllers.editUser = [verifyToken, editUser];



module.exports = controllers