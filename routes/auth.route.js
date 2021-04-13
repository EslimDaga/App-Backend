const express = require("express");
const router = express.Router();

//Validations
const { validRegister,validLogin,forgotPasswordValidator,resertPasswordValidator } = require("../helpers/valid");

//Load Controllers
const { registerController,activationController } = require("../controllers/auth.controller");

router.post("/register",validRegister,registerController);
router.post("/activation",activationController);

module.exports = router;