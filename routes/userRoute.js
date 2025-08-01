const express = require("express")
const router = express.Router()
const upload = require("../middlewares/fileupload")
const { registerUser, loginUser ,getUser , updateUser , resetPassword, sendResetLink } = require("../controllers/userController") 

router.post(
    "/register",
    upload.single("profileImage"),
    registerUser
)

router.post(
    "/login",
    loginUser
)



router.get("/:id", getUser);
// For updating the profile image
router.put(
  "/:id",
  upload.single("profileImage"),
  updateUser
);

router.post("/request-reset", sendResetLink);
router.post("/reset-password/:token", resetPassword);

module.exports = router