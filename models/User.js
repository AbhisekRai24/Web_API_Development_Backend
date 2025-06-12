
const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String, 
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        role:{
            type: String,
            default: "normal"
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model(
    "User", UserSchema
)

Userroutes//

const express = require("express")
const router = express.Router()

const { registerUser, loginUser } = require("../controllers/userController") 

router.post(
    "/register",
    registerUser
)

router.post(
    "/login",
    loginUser
)
module.exports = router


