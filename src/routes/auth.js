import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import validateUserName from "../validate/validateUserName.js";
import validateEmail from "../validate/validateEmail.js";
import validatePassword from "../validate/validatePassword.js";
//--------------------------------------------------------------
const saltRounds = 10;
const router = express.Router();
dotenv.config();
//--------------------------------------------------------------
router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  // Simple validation
  if (
    !validateUserName(userName) ||
    !validateEmail(email) ||
    !validatePassword(password)
  )
    return res
      .status(400)
      .json({ success: false, message: "Error with userName and/or password" });
  try {
    // Check for existing user or email
    const userOrEmail = await User.findOne({ $or: [{ userName }, { email }] });
    if (userOrEmail)
      return res
        .status(400)
        .json({ success: false, message: "userName or email already taken" });
    // All good
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Simple validation
  if (!validateEmail(email) || !validatePassword(password))
    return res.status(400).json({
      success: false,
      message: "Error with email and/or password",
    });
  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Not found" });
    // email found -> verify password
    //user.password get from db, password get from req
    const passwordValid = bcrypt.compareSync(password, user.password); // true
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    // All good
    // Return token, set expires on 60 seccond
    // const accessToken = jwt.sign({ userId: user._id },process.env.ACCESS_TOKEN_SECRET,{expiresIn: '60s'});
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.post("/logout", (req, res) => {
  try {
    res.sendStatus(200);
  } catch (err) {
    res.status(403).json(err);
  }
});

export default router;
