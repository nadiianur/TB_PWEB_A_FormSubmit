const User = require("../models/users.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var bodyParser = require('body-parser');
require("dotenv").config();
const controllers = {}

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

const viewRegister = async (req,res) => {
    res.render('signup');
  }
controllers.viewRegister = viewRegister

// const getUser = async(req,res) => {
//   const { id } = req.params;
//   try{
//     const user = await User.findOne({ where: { id } });
//     res.json(user);
//   } catch (error){
//     res.status(400).json({ msg: error.message })
//   }
// }
// controllers.getUser = getUser

const getProfile = (req, res) => {
    res.render('profile');
  }
controllers.getProfile = getProfile;

const editUser = async(req,res) => {
  let userId = req.params.user_id;
  const {nama, username, email, password, avatar} = req.body;
  
  try{
    const update = await User.update({
      username: username,
      email: email,
      password: password,
      nama: nama,
      avatar: avatar
    },{ 
      where:{ user_id: userId }
    })
    if(update){
      res.json({ msg:"Edit Profile Success", success: 'true'})
    } else {
      res.json({ msg: 'Register Failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
  
}
controllers.editUser = editUser;

  const getEditProfile = (req, res) => {
    res.render('editProfile');
  }
  controllers.getEditProfile = getEditProfile;

  module.exports = controllers