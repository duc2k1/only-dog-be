import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "redis";
import dotenv from "dotenv";
import User from "../models/User.js";
import validateUserName from "../validate/validateUserName.js";
import validateEmail from "../validate/validateEmail.js";
import validatePassword from "../validate/validatePassword.js";
//--------------------------------------------------------------
const saltRounds = 10;
const router = express.Router();
dotenv.config();
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
let refreshTokens = [];
const key = "refreshToken";
//--------------------------------------------------------------
router.delete("/remove_all_refresh_token", (req, res) => {
  try {
    redisClient.get(key, (err, data) => {
      if (err) return;
      if (data) {
        redisClient.set(key, JSON.stringify([]));
      }
    });
    res
      .status(200)
      .json({ success: true, message: "Remove all refresh token success" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.delete("/remove_refresh_token", (req, res) => {
  try {
    const refreshToken = req.headers.authorization.split(" ")[1];
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
    res
      .status(200)
      .json({ success: true, message: "Remove refresh token success" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.put("/refresh_access_token", (req, res) => {
  const refreshToken = req.headers.authorization.split(" ")[1];
  if (!refreshToken) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({ success: false, message: "Invalid Refresh Token" });
    return;
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }
    const accessToken = jwt.sign(
      { userName: data.userName },
      process.env.ACCESS_TOKEN_SECRET
      // {
      //   expiresIn: "30m",
      // }
    );
    res.status(200).json({ success: true, accessToken });
  });
});
router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  if (
    !validateUserName(userName) ||
    !validateEmail(email) ||
    !validatePassword(password)
  )
    return res.status(400).json({
      success: false,
      message: "Error with User Name and/or Password",
    });
  try {
    const userOrEmail = await User.findOne({ $or: [{ userName }, { email }] });
    if (userOrEmail)
      return res
        .status(400)
        .json({ success: false, message: "User Name or Email already taken" });
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email) || !validatePassword(password))
    return res.status(400).json({
      success: false,
      message: "Error with email and/or password",
    });
  try {
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
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
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
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
export default router;
