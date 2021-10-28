import express from "express";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import Post from "../models/Post.js";
const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";
//--------------------------------------------------------------
//user_id: user current (userId) => send from body
//user_id_follow: user has followed by another one
router.put("/follow_and_unfollow", verifyAccessToken, async (req, res) => {
  const { userIdFollow, userIdBeFollow } = req.body;
  const accessToken = req.headers.authorization.split(" ")[1];
  if (userIdFollow !== jwt.decode(accessToken).userId) {
    res.status(403).json({
      success: false,
      message: "Invalid userId",
    });
    return;
  }
  if (!userIdFollow || !userIdBeFollow) {
    res.status(404).json({
      success: false,
      message: "Not have userIdFollow and/or userIdBeFollow",
    });
    return;
  }
  if (userIdFollow === userIdBeFollow) {
    res.status(403).json({
      success: false,
      message: "You can't follow yourself",
    });
    return;
  }
  try {
    const yourSelf = await User.findById(userIdFollow);
    const userBeFollow = await User.findById(userIdBeFollow);
    if (!yourSelf.followings.includes(userIdBeFollow)) {
      //follow
      await yourSelf.updateOne({ $push: { followings: userIdBeFollow } }); //yourself
      await userBeFollow.updateOne({ $push: { followers: userIdFollow } }); //other user
      res.status(200).json({ success: true, message: "User was followed" });
    } else {
      //unfollow
      await yourSelf.updateOne({ $pull: { followings: userIdBeFollow } }); //yourself
      await userBeFollow.updateOne({ $pull: { followers: userIdFollow } }); //other user
      res.status(200).json({ success: true, message: "User was unfollowed" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//use for find user by name
router.get("/find_by_name/:userName", async (req, res) => {
  const { userName } = req.params; //get from body
  if (!userName) {
    res.status(404).json({ success: false, message: "Not found user" });
    return;
  }
  try {
    const users = await User.find({
      userName: { $regex: userName, $options: "i" },
    }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//use for profile user
router.get("/find_by_id/:userId", async (req, res) => {
  const { userId } = req.params; //get from body
  if (!userId) {
    res.status(404).json({ success: false, message: "Not found user" });
    return;
  }
  try {
    const user = await User.findById(userId).select("-password");
    if (user) user.posts = await Post.find({ userId });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.get("/get_all", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
export default router;
