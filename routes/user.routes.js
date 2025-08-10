const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController =require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// register
router.post("/register",[
    body("email").isEmail().withMessage("please enter a valid email"),
    body("fullname.firstname").isLength({min:3}).withMessage("first name must be at least 3 characters long"),
    body("password").isLength({min:6}).withMessage("password must be at least 6 characters Long"),
],
userController.registerUser
);



// login
router.post("/login",[
    body("email").isEmail().withMessage("please enter valid email"),
    body("password").isLength({min:6}).withMessage("password required")
],
userController.loginUser)


// get profile
router.get("/profile",authMiddleware.authUser,userController.getUserProfile)

// logout
router.get("/logout",authMiddleware.authUser,userController.logoutUser)







module.exports = router;