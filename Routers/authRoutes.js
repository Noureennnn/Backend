const express = require("express");
const { loginUser, registerUser } = require("../Controllers/authController");

const router = express.Router();
router.post("/login", loginUser);
router.post("/", loginUser);
router.post("/register", registerUser);

module.exports = router;