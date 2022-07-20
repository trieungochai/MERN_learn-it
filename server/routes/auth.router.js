require("dotenv").config();
const express = require("express");
const User = require("../models/user.model");
const argon2 = require("argon2");
const JWT = require("jsonwebtoken");

const authRouter = express.Router();

// @route POST api/auth/register
// @desc Register user
// @access Public
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (user)
      return res.status(400).json({
        success: false,
        message: "This username is already taken",
      });

    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Return token
    const accessToken = JWT.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).json({
      success: true,
      message: "Your account has been successfully created",
      accessToken,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = authRouter;
