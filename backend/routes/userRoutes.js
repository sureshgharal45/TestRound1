const express = require("express");
const { registerUser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/Auth");

const router = express.Router();

router.post("/login", registerUser);

module.exports = router;
