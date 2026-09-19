const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { register, login, getMe, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);       // protects private routes — Module 5
router.put("/profile", protect, updateProfile); // update display name — Module 5

module.exports = router;
