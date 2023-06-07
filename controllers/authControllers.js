const User = require("../models/users.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var bodyParser = require('body-parser');
require("dotenv").config();
const {
  response
} = require('express');
const controllers = {}

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
    // if(!req.session.user_id){
    //     return res.status(401).json({ msg: "Please, login into your account" })
    // }
    // const user = await User.findOne ({
    //     attributes :  [ 'user_id', 'username', 'email', 'avatar' ],
    //     where : {
    //         user_id : req.session.user_id
    //     }
    // })
    // if (!user){
    //     return res.status(404).json({ message : 'User Not Found'})
    // }
}
controllers.viewLogin = viewLogin;

const logOut = (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //       console.log(err);
  //       return res.status(400).json({
  //           success: false,
  //           message: 'Cant logout',
  //       });
  //   }

  //   res.clearCookie('sessionUser_Id');
  //   return res.status(200).json({
  //       success: true,
  //       message: 'Logout berhasil',
  //       // res.redirect("/auth/login")
  //   });
  // });

  res.redirect("/auth/login");
  res.status(200).json({msg: 'OK'})
}
controllers.logOut = logOut;

module.exports = controllers;