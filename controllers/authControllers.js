const User = require("../models/users.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  response
} = require('express');
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


controllers.login = async(req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  try{
    //Mengecek atau mencari user berdasarkan username
    const user = await User.findOne({
      where:{ 
        username: username
      }
    });
    //Jika username tidak ditemukan 
    if (!user) {
      return res.status(401).json({ msg: "Username not valid" });
    }
    //Mengecek password
    const match = await bcrypt.compare(password, user.password, async (err, result) => {
    if (err || !result) {
      return res.status(401).json({msg : "Password wrong"});
    }

    //Akses Token jika berhasil login
    const accessToken = jwt.sign(
    { user_id: user.user_id},
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1000s',
    });

    req.session.user_id = user.user_id;

    res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
    });
    
    res.status(200).json({
      msg:'Login Success', 
      token:accessToken,
      success: 'ok',
      user_id: req.session.user_id
    });
  });
  } catch (error) {
    res.status(404).json({msg: "Failed Login"})
  }
}


const viewLogin = async (req, res) => {
  res.render('signin');
}
controllers.viewLogin = viewLogin;


const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            msg: 'Cant logout',
        });
    }

    res.clearCookie('sessionId');
    return res.status(200).json({
        success: true,
        msg: 'Logout berhasil',
    });
  });
}
controllers.logOut = [verifyToken, logOut];

module.exports = controllers;