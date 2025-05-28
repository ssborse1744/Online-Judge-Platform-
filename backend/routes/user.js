const express = require('express');

const router= express.Router();

//controller functions
const {registerUser,loginUser}=require('../controllers/user.controller')


//login route
router.post('/login',loginUser)

//register route
router.post('/register',registerUser)

module.exports= router