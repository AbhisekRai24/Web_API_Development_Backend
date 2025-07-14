const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const fs = require("fs");
const path = require("path");

exports.registerUser = async (req, res) => {

    const { username, email, firstName,
        lastName, password } = req.body
    const profileImage = req.file ? req.file.path : null;
    // validation
    if (!username || !email || !password) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing fields"
            }
        )
    }
    // db logic in try/catch
    try {
        const existingUser = await User.findOne(
            {
                $or: [{ "username": username },
                { "email": email }]
            }
        )
        if (existingUser) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "User exists"
                }
            )
        }
        // hash password
        const hasedPas = await bcrypt.hash(
            password, 10
        ) // 10 is complexity
        const newUser = new User({
            username,
            email,
            firstName,
            lastName,
            password: hasedPas,
            profileImage
        })
        await newUser.save()
        return res.status(201).json(
            {
                "success": true,
                "message": "User Registered"
            }
        )
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    // validation
    if (!email || !password) {
        return res.status(400).json(
            { "success": false, "message": "Missing field" }
        )
    }
    try {
        const getUser = await User.findOne(
            { email: email }
        )
        if (!getUser) {
            return res.status(403).json(
                { "success": false, "message": "User not found" }
            )
        }
        const passwordCHeck = await bcrypt.compare(password, getUser.password) // pass, hashed password
        if (!passwordCHeck) {
            return res.status(403).json(
                { "success": false, "message": "Invalid credentials" }
            )
        }
        const payload = {
            "_id": getUser._id,
            "role": getUser.role,
            "email": getUser.email,
            "username": getUser.username,
            "firstName": getUser.firstName,
            "lastName": getUser.lastName,
            "profileImage": getUser.profileImage,

        }
        const token = jwt.sign(payload, process.env.SECRET,
            { expiresIn: "7d" }
        )
        return res.status(200).json(
            {
                "success": true,
                "message": "Login Successful",
                "data": getUser,
                "token": token // return token in login
            }
        )
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}

// Get user by ID (excluding password)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// Update user info and optional profile image
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If new profile image uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "..", user.profileImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.warn("Failed to delete old profile image:", err.message);
          }
        });
      }
      updateData.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// const transporter = nodemailer.createTransport(
//     {
//         service: "gmail",
//         auth:{
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     }
// )

// exports.sendRestLink = async (req,res) => {
//     const {email} = req.body
//     try{
//         const user = await User.findOne({email})
//         if(!user) return res.status(400).json({success: false, message : "USer not found"})
//             const token = jwt.sign({id:})
//     }
// }

