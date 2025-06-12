const mongoose = require("mongoose")
const CONNECTION_STRING = process.env.MONGODB_URI
console.log(process.env)
const connectDB = async () => {
    try{
        await mongoose.connect(
            CONNECTION_STRING,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
    }catch(err){
        console.log("DB Err" , err)
    }
}
module.exports = connectDB