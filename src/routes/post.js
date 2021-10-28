import express from "express";
import multer from "multer";
import verifyAccessToken from "../middlewares/verifyAccessToken.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
//--------------------------------------------------------------
const router = express.Router();
//--------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------
router.post("/add/:userId", verifyAccessToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(404).json({ success: false, message: "Not found userId" });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "Not found user" });
      return;
    }
    const post = await Post({
      userId,
    }).save();
    await user.updateOne({ $push: { posts: post._id.toString() } });
    res.status(200).json({ success: true, post, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.put("/like", verifyAccessToken, async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!userId || !postId) {
      res.status(404).json({
        success: false,
        message: "Not found postId or/and userId",
      });
      return;
    }
    if (userId !== jwt.decode(accessToken).userId) {
      res.status(403).json({
        success: false,
        message: "Invalid userId",
      });
      return;
    }
    const post = await Post.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      //check user da disliked trc do chua, neu r thi undisliked
      if (post.dislikes.includes(userId)) {
        await post.updateOne({ $pull: { dislikes: userId } });
        res.status(200).json({
          success: true,
          message: userId + " liked and undisliked post " + postId,
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: userId + " liked post " + postId,
      });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({
        success: true,
        message: userId + " unliked post " + postId,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//--------------------------------------------------------------
router.put("/dislike", verifyAccessToken, async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!userId || !postId) {
      res.status(404).json({
        success: false,
        message: "Not found postId or/and userId",
      });
      return;
    }
    if (userId !== jwt.decode(accessToken).userId) {
      res.status(403).json({
        success: false,
        message: "Invalid userId",
      });
      return;
    }
    const post = await Post.findById(postId);
    if (!post.dislikes.includes(userId)) {
      await post.updateOne({ $push: { dislikes: userId } });
      //check user da liked trc do chua, neu r thi unliked
      if (post.likes.includes(userId)) {
        await post.updateOne({ $pull: { likes: userId } });
        res.status(200).json({
          success: true,
          message: userId + " disliked and unliked post " + postId,
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: userId + " disliked post " + postId,
      });
    } else {
      await post.updateOne({ $pull: { dislikes: userId } });
      res.status(200).json({
        success: true,
        message: userId + " undisliked post " + postId,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//--------------------------------------------------------------
router.get("/get_all", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.post("/upload", upload.single("avatar"), async (req, res, next) => {
  const file = req.file;
  console.log(file);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});
//--------------------------------------------------------------
export default router;
