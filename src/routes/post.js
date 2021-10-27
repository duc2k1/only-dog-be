import express from "express";
import multer from "multer";
import verifyToken from "../middlewares/auth.js";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
//--------------------------------------------------------------
const router = express.Router();
//--------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------
router.post("/add", verifyToken, async (req, res) => {
  try {
    const post = await Post({
      userId: "61796a42a47a2f0cba34a7f2",
    }).save();
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.put("/like", verifyToken, async (req, res) => {
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
router.put("/dislike", verifyToken, async (req, res) => {
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
router.get("/", async (req, res) => {
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
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});
//--------------------------------------------------------------
export default router;
