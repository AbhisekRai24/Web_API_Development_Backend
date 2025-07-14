const request = require("supertest")
const app = require("../index")
const User = require("../models/User")
const mongoose = require("mongoose")

afterAll(async () => {
    await mongoose.disconnect()
})
let authToken





describe(
    "User Authentication API",
    () => {
        beforeAll(async () => {
            await User.deleteMany({ email: "ab@gmail.com" })
        })

        test(
            "validates the registration form",
            async () => {
               
                const res = await request(app)
                    .post("/api/auth/register")
                    .send(
                        {
                            firstName: "ab",
                            email: "ab01@gmail.com"
                        }
                    )
               
                expect(res.statusCode).toBe(400)
                expect(res.body.success).toBe(false)
                expect(res.body.message).toBe("Missing fields")
            }
        )
           test(
            "can register user",
            async () => {
                const res = await request(app)
                    .post("/api/auth/register")
                    .send(
                        {
                            firstName: "ab",
                            lastName: "rai",
                            username: "aa",
                            email: "ab@gmail.com",
                            password: "password"
                        }
                    )
                expect(res.statusCode).toBe(201)
                expect(res.body.success).toBe(true)
            }
        )



        
     
)