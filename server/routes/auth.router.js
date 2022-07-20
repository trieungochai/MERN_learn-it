require("dotenv").config();
const express = require("express");
const User = require("../models/user.model");
const argon2 = require("argon2");
const JWT = require("jsonwebtoken");

const authRouter = express.Router();

// @route POST api/auth/register
// @desc User Registration
// @access Public
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing Username and/or Password" });

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (user)
      return res.status(400).json({
        success: false,
        message: "This Username is already taken",
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
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// @route POST api/auth/login
// @desc User Login
// @access Public
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing Username and/or Password",
    });

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "The Username or Password is Incorrect",
      });

    // Username has found
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword)
      return res.status(400).json({
        success: false,
        message: "The Username or Password is Incorrect",
      });

    // All good
    const accessToken = JWT.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).json({
      success: true,
      message: "You are successfully signed in",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = authRouter;
