const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const {validationResult} = require("express-validator");




// register
module.exports.registerUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array() });
    }

    const {fullname,email,password} = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    })

    const token =user.generateAuthToken();

    return res.status(201).json({token,user})
    
}

// login

exports.loginUser = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} = req.body;

    // by default apn ne password ko select:false kiya hai kyu ki {find} query chalne pr password nhi aayega ,
    //  pr jab apn select ('+password') use karte hain to password bhi aayega

    const user = await userModel.findOne({email}).select('+passwword');


    if(!user){
        return res.status(401).json({message:"user not found"})
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:"password not match"})
    }

    // genreate token
    const token = user.generateAuthToken();
    res.cookie('token',token,{
        httpOnly:true
    });

    return res.status(200).json({token,user})
}

// get profile controller
exports.getUserProfile = async(req,res,next)=>{
    res.status(200).json(req.user)

}