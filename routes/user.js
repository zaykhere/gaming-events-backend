const express = require("express");
const router = express.Router();

const {register, emailVerify, resendEmailCode} = require("../controllers/user");

router.post("/register", register);
router.post("/emailVerify", emailVerify);
router.get("/resendEmailCode/:email", resendEmailCode);

module.exports = router;