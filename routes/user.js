const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.js");
const emailValidator = require("../middleware/emailValidator.js");

router.post("/signup", emailValidator, userCtrl.signup);
router.post("/login", emailValidator, userCtrl.login);

module.exports = router;