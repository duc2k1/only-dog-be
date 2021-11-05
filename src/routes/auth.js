import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import validateUserName from "../validate/validateUserName.js";
import validateEmail from "../validate/validateEmail.js";
import validatePassword from "../validate/validatePassword.js";
import verifyToken from "../middlewares/auth.js";
//--------------------------------------------------------------
const saltRounds = 10;
const router = express.Router();
dotenv.config();
//--------------------------------------------------------------
router.delete("/remove_refresh_token", (req, res) => {
  try {
    const refreshToken = req.headers.authorization.split(" ")[1];
    res
      .status(200)
      .json({ success: true, message: "Remove refresh token success" });
    redisClient.get(key, (err, data) => {
      if (err) return;
      if (data) {
        refreshTokens = JSON.parse(data).filter(
          (refToken) => refToken !== refreshToken
        );
        console.log("~ refreshTokens", refreshTokens);
        redisClient.set(key, JSON.stringify(refreshTokens));
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
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
    const userOrEmail = await User.findOne({ $or: [{ userName }, { email }] });
    if (userOrEmail)
      return res
        .status(400)
        .json({ success: false, message: "userName or email already taken" });
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
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
  try {
    const { email, password } = req.body;
    if (!validateEmail(email) || !validatePassword(password))
      return res.status(400).json({
        success: false,
        message: "Invalid email and/or password",
      });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Not found Email" });
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    //-------------------------------------------
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
      // { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET
      // { expiresIn: "7d" }
    );
    refreshTokens.push(refreshToken);
    res.json({
      success: true,
      accessToken,
      refreshToken,
    });
    redisClient.get(key, (err, data) => {
      if (err) return;
      if (data) {
        refreshTokens = JSON.parse(data);
        refreshTokens.push(refreshToken);
        console.log("~ refreshTokens", refreshTokens);
        redisClient.set(key, JSON.stringify(refreshTokens));
      }
    });
  } catch (error) {
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
//--------------------------------------------------------------
let refreshTokens = [];
router.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign(
      { userName: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );
    res.json({ accessToken });
  });
});
export default router;
