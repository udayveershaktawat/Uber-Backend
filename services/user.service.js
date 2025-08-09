const userModel = require("../models/user.model");




module.exports.createUser = async({fullname,email,password})=>{
    if(!fullname.firstname || !email || !password){
        throw new Error("all fields are required");
    }


    const user = await userModel.create({
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname
        },
        email,
        password
    })

    return user;
}