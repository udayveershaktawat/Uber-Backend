const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,"First name require min 3 characters"]
        },
        lastname:{
            type:String,
            minLength:[3,"minimum 3 character required"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    socketId:{
        type:String
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'color must be atleast 3 characters long']
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,"plate must be at least 3 characters long"]
        },
        capacity:{
            type:Number,
            required:true,
            minlength:[1,"capacity must be at least 1"]
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car',"motorcycle","auto"]
        }
    },
    location:{
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    }
})

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"24h"})
    return token;

}

captainSchema.methods.comparePassword = async function(){
    return await bcrypt.compare(password,this.password)
},

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);

}









module.exports = mongoose.model("captainModel",captainSchema);