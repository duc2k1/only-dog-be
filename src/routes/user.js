import express from "express";
import multer from "multer";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import Post from "../models/Post.js";
const router = express.Router();
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import validateUserName from "../validate/validateUserName.js";
import { nanoid } from "nanoid";
//--------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/images/");
  },
  filename: function (req, file, cb) {
    const imageName = nanoid() + "." + file.mimetype.split("/")[1];
    req.imageName = imageName;
    cb(null, imageName);
  },
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------
router.post(
  "/change_avatar_user/:userId",
  verifyAccessToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { version } = req.body;
      const file = req.file;
      if (!version)
        return res
          .status(404)
          .json({ success: false, message: "Not found version userid" });
      if (!userId)
        return res
          .status(404)
          .json({ success: false, message: "Not found userId" });
      if (!file)
        return res
          .status(404)
          .json({ success: false, message: "Not found file" });
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Not found user" });
      //----------------------------------------
      if (user.version !== +version) {
        return res.json({ success: false, message: "Optimistic" });
      } else {
        const pathImage = "/images/" + req.imageName;
        res.status(200).json({ success: true, pathImage });
        try {
          user.pathAvatar = pathImage;
          await user.save();
        } catch (error) {
          console.log(error);
          return res.json({ success: false, message: "Optimistic" });
        }
      }
      //----------------------------------------
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
//-------------------------------------------------------------
//use for dashboard userId
router.get("/get_dashboard_user_id/:userId", async (req, res) => {
  try {
    //-------------------------------------------------------------
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Not found user" });
    //------------------------------------------------------------
    const allPostOfUser = await Post.find().where("userId").in(user.followings);
    const allPostInDb = await Post.find().then((val) =>
      val.concat(allPostOfUser)
    );
    const users = await User.find();
    res.status(200).json({ success: true, posts: allPostInDb, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.put("/follow_and_unfollow", verifyAccessToken, async (req, res) => {
  try {
    //--validate all
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
    if (!yourSelf || !userBeFollow)
      return res.status(403).json({
        success: false,
        message: "Not found userIdFollow and/or userIdBeFollow",
      });
    //--------------------------------------------------
    if (!yourSelf.followings.includes(userIdBeFollow)) {
      //follow
      res.status(200).json({ success: true, message: "User was followed" });
      await yourSelf.updateOne({ $push: { followings: userIdBeFollow } }); //yourself
      await userBeFollow.updateOne({ $push: { followers: userIdFollow } }); //other user
    } else {
      //unfollow
      res.status(200).json({ success: true, message: "User was unfollowed" });
      await yourSelf.updateOne({ $pull: { followings: userIdBeFollow } }); //yourself
      await userBeFollow.updateOne({ $pull: { followers: userIdFollow } }); //other user
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//use for find user by name
router.get("/find_by_name/:userName", async (req, res) => {
  const { userName } = req.params;
  //----------------------------------
  if (!validateUserName(userName))
    return res.status(400).json({
      success: false,
      users: [],
    });
  //----------------------------------
  const users = await User.find({
    userName: { $regex: userName, $options: "i" },
  }).select("-password");
  return res.status(200).json({ success: true, users });
});
//--------------------------------------------------------------
//use for profile user
router.get("/find_by_id/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // if (!userId)
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Not found user" });
    const user = await User.findById(userId).select("-password");
    //-------------------------------------
    user.posts = await Post.find().where("_id").in(user.posts);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Not found user  and/or internal server error",
    });
  }
});
//--------------------------------------------------------------
router.delete("/delete/:userId", verifyAccessToken, async (req, res) => {
  try {
    //--validate all
    const { userId } = req.params;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Not found userID",
      });
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    if (userId === jwt.decode(accessToken).userId) {
      const user = await User.findById(userId).select("-password");
      console.log(user);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Not found user" });
      } else {
        await User.findByIdAndDelete(userId);
        return res
          .status(200)
          .json({ success: true, message: "Account have been deleted" });
      }
    } else {
      return res
        .status(403)
        .json({ success: false, message: "You can delete your account" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.get("/get_all", async (req, res) => {
  const users = await User.find().select("-password");
  return res.status(200).json({ success: true, users });
});
//--------------------------------------------------------------
export default router;
