const User = require('../model/User')


//login user

const loginUser = async(req,res)=>{
    res.json({mssg:'login user'})
}

//register user
const registerUser = async(req,res)=>{
    res.json({mssg:'register user'})
}

module.exports ={registerUser,loginUser};