const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const users = require("../models/users");
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  //   console.log(token)
  if (!token) {
    res.json({msg :"Invalid token"})
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

module.exports = verifyToken;