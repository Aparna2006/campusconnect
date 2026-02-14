const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const validateBody = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/schemas");

const router = express.Router();

router.post("/register", validateBody(registerSchema), registerUser);
router.post("/login", validateBody(loginSchema), loginUser);

module.exports = router;
