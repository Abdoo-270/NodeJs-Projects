const express = require("express");
const router = express.Router();
const authenticationUser = require("../middleware/authentication");
const testUser = require("../middleware/testUser");

const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    msg: "too many requests, please try again after 10 minutes",
  },
});

const { register, login, updateUser } = require("../controllers/auth");
router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.patch("/updateUser", authenticationUser, testUser, updateUser);

module.exports = router;
