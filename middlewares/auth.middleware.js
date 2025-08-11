const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();




exports.authUser = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split('')[1];

    if(!token ){
        return res.status(401).json({message:"unauthorized"})
    }

    const isBlacklisted = await userModel.findOne({token:token});

    if(isBlacklisted){
        res.status(401).json({message:"unauthorized"})
    }


    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decode._id)

        req.user = user

        return next();

    }
    catch(error){
        return res.status(401).json({message:"unAuthorizes",error})
    }

}