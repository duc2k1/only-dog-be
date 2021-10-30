import express from "express";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import Post from "../models/Post.js";
const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";
//--------------------------------------------------------------
//use for dashboard userId
router.get("/get_dashboard_user_id/:userId", async (req, res) => {
  try {
    //-------------------------------------------------------------
    const { userId } = req.params;
    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "Not found userId" });
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Not found user" });
    //------------------------------------------------------------
    const posts = await Post.find().where("userId").in(user.followings);
    const users = await User.find();
    return res.status(200).json({ success: true, posts, users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//user_id: user current (userId) => send from params
//user_id_follow: user has followed by another one
router.put("/follow_and_unfollow", verifyAccessToken, async (req, res) => {
  try {
    const { userIdFollow, userIdBeFollow } = req.body;
    const accessToken = req.headers.authorization.split(" ")[1];
    if (userIdFollow !== jwt.decode(accessToken).userId)
      return res.status(403).json({
        success: false,
        message: "Invalid userId",
      });
    if (!userIdFollow || !userIdBeFollow)
      return res.status(404).json({
        success: false,
        message: "Not have userIdFollow and/or userIdBeFollow",
      });
    if (userIdFollow === userIdBeFollow)
      return res.status(403).json({
        success: false,
        message: "You can't follow yourself",
      });
    const yourSelf = await User.findById(userIdFollow);
    const userBeFollow = await User.findById(userIdBeFollow);
    if (!yourSelf.followings.includes(userIdBeFollow)) {
      //follow
      await yourSelf.updateOne({ $push: { followings: userIdBeFollow } }); //yourself
      await userBeFollow.updateOne({ $push: { followers: userIdFollow } }); //other user
      return res
        .status(200)
        .json({ success: true, message: "User was followed" });
    } else {
      //unfollow
      await yourSelf.updateOne({ $pull: { followings: userIdBeFollow } }); //yourself
      await userBeFollow.updateOne({ $pull: { followers: userIdFollow } }); //other user
      return res
        .status(200)
        .json({ success: true, message: "User was unfollowed" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//use for find user by name
router.get("/find_by_name/:userName", async (req, res) => {
  try {
    const { userName } = req.params; //get from body
    if (!userName)
      return res
        .status(404)
        .json({ success: false, message: "Not found user" });
    const users = await User.find({
      userName: { $regex: userName, $options: "i" },
    }).select("-password");
    return res.json({ success: true, users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//use for profile user
router.get("/find_by_id/:userId", async (req, res) => {
  try {
    const { userId } = req.params; //get from body
    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "Not found userId" });
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Not found user" });
    user.posts = await Post.find().where("_id").in(user.posts);
    return res.json({ success: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.get("/get_all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ success: true, users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
export default router;
