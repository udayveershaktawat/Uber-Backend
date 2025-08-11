const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const {validationResult} = require("express-validator")



// register
exports.registerCaptain = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }

    const {fullname,email,password,vehicle} = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({email});

    if(isCaptainAlreadyExist){
        return res.status(400).json({message:"captain already exist"})
    }

    const hashedPassword = await captainModel.hashPassword(password);


    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({token,captain})

}

// login
exports.loginCaptain = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password} = req.body;

    const captain = await captainModel.findOne({email}).select('+password')

    if(!captain){
        return res.status(401).json({message:"invalid password or email"})

    }

    const isMatch = await captain.comparePassword(password);


    if(!isMatch){
        return res.status(401).json({message:"invalid email or password"})
    }


    const token = await captain.generateAuthToken();

    res.cookie("token",token)


    res.status(200).json(token,captain)
}