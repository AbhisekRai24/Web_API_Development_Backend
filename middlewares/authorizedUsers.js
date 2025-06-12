const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization // from request header
        if (!authHeader) {
            return res.status(403).json(
                { "success": false, "message": "Token required" }
            )
        }
        const token = authHeader.split(" ")[1]; // "Bearer <token>"
        const decoded = jwt.verify(token, process.env.SECRET) // verify with same secret
        const userId = decoded._id // from payload
        const user = await User.findOne({ _id: userId })
       
