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
const register = async(req,res) => {
    const { nama, username, email, password, confPassword } = req.body;
    if (password !== confPassword)
    return res.status(400).json({msg: "Password doesnt match", success: 'failedPassword'});

    try{
      const userExists = await User.findOne({ where: { username } });
      if (userExists) {
        res.status(400).json({ msg: 'Username already exists', success: false });
        return;
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash (password, salt);
      const user = await User.create({
        nama: nama,
        username : username,
        email : email, 
        password : hashPassword,
        active : '1',
        avatar : 'picture'
      });
      if (user){
        res.json({ msg:"Register Successfully!", success: 'true'})
      } else {
        res.json({ msg: 'Register Failed' });
      }
    } catch (error){
        res.status(400).json({ msg: error.message })
    }
  }
controllers.register = register
// ini buat get halaman register akun
const viewRegister = async (req,res) => {
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
const getEditProfile = async(req, res) => {
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
controllers.getEditProfile = [verifyToken,getEditProfile];
// ini buat post data edit profile
const editUser = async(req,res) => {
  try {
    const findUser = await User.findOne({
      where: {
          user_id: req.session.user_id
      }
  });

    const user_id = findUser.user_id
    const realUsername = findUser.username
    const realEmail = findUser.email
    const realNama = findUser.nama

    const username = req.body.username || realUsername
    const email = req.body.email || realEmail
    const nama = req.body.nama || realNama

    const passwordBaru = req.body.passwordBaru
    const passwordLama = req.body.passwordLama

    if (passwordBaru == '' && passwordLama == '') {
        if (!username || !email || !nama) {
            res.status(400).json({
                success: false,
                msg: 'Data not valid'
            })
        } else {
            if (username.length < 10) {
                res.status(400).json({
                    success: false,
                    msg: 'Username must 10 characters'
                })
            } else {
                const newData = await User.update({
                    username: username,
                    email: email,
                    nama: nama,
                }, {
                    where: {
                        user_id: user_id
                    }
                })

                if (newData) {
                    const findUserBaru = await User.findByPk(user_id)
                    const usernameBaru = findUserBaru.username
                    const emailBaru = findUserBaru.email
                    const namaBaru = findUserBaru.nama

                    res.status(200).json({
                        success: true,
                        username: usernameBaru,
                        email: emailBaru,
                        nama: namaBaru,
                        msg: 'Data Sucessfully Update'
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Try agail later!'
                    })
                }
            }

        }
    } else if (passwordBaru != '' && passwordLama == '') {
        res.status(400).json({
            success: false,
            msg: 'Please fill in Old Password'
        })
    } else if (passwordBaru == '' && passwordLama != '') {
        res.status(400).json({
            success: false,
            msg: 'Please fill in New Password'
        })
    } else {
        const passwordAsli = findUser.password

        const salt = bcrypt.genSaltSync(10);
        const passwordMatch = bcrypt.compareSync(passwordLama, passwordAsli);


        if (!username || !email || !username || !passwordBaru || !passwordLama) {
            res.status(400).json({
                success: false,
                msg: 'Try again'
            })
        } else {
            if (username.length < 15) {
                res.status(400).json({
                    success: false,
                    msg: 'Username must 15 characters'
                })
            } else {
                if (passwordMatch) {
                    const hashedPasswordBaru = bcrypt.hashSync(passwordBaru, salt)
                    const newData = await User.update({
                        username: username,
                        password: hashedPasswordBaru,
                        email: email,
                        nama: nama,
                    }, {
                        where: {
                            user_id: user_id
                        }
                    })

                    if (newData) {
                        const findUserBaru = await User.findByPk(user_id)
                        const newUsername = findUserBaru.username
                        const newEmail = findUserBaru.email
                        const newNama = findUserBaru.nama

                        res.status(200).json({
                            success: true,
                            username: newUsername,
                            email: newEmail,
                            nama: newNama,
                            msg: 'Profile Sucessfully Updated'
                        })
                    } else {
                        res.status(400).json({
                            success: false,
                            message: 'Try again!'
                        })
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        msg: 'Wrong Old Password'
                    })
                }
            }
        }
    }
  } catch (error) {
    return res.redirect('/auth/login');
  }
  }
controllers.editUser = [verifyToken, editUser];



  module.exports = controllers