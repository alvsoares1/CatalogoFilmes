const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/cadastro", authController.cadastro);
router.post("/login", authController.login);

module.exports = router;
