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
    cb(null, "src/images/");
  },
  filename: function (req, file, cb) {
    file.originalname = file.originalname.trim().replace(/ /g, "-");
    cb(null, req.params.userId + file.originalname);
  },
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------
router.post(
  "/add_image_post/:userId",
  verifyAccessToken,
  upload.single("imagePost"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const file = req.file;
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
      file.originalname = file.originalname.trim().replace(/ /g, "-");
      const pathImage =
        "/images/posts/" + req.params.userId + file.originalname;
      const post = await Post({
        userId,
        pathImage,
      }).save();
      res.status(200).json({ success: true, pathImage });
      await user.updateOne({ $push: { posts: post._id.toString() } });
    } catch (error) {
      console.log("~ error", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
//--------------------------------------------------------------
router.put("/like", verifyAccessToken, async (req, res) => {
  try {
    //--validate all
    const { userId, postId } = req.body;
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!userId || !postId)
      return res.status(404).json({
        success: false,
        message: "Not found postId or/and userId",
      });
    if (userId !== jwt.decode(accessToken).userId)
      return res.status(403).json({
        success: false,
        message: "Invalid userId",
      });
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        success: false,
        message: "Not found post",
      });
    //---------------------------------------------
    if (!post.likes.includes(userId)) {
      //check user da disliked trc do chua, neu r thi undisliked
      if (post.dislikes.includes(userId)) {
        res.status(200).json({
          success: true,
          message: "liked and undisliked",
        });
        await post.updateOne({ $push: { likes: userId } });
        await post.updateOne({ $pull: { dislikes: userId } });
      } else {
        res.status(200).json({
          success: true,
          message: "liked",
        });
        await post.updateOne({ $push: { likes: userId } });
      }
    } else {
      res.status(200).json({
        success: true,
        message: "unliked",
      });
      await post.updateOne({ $pull: { likes: userId } });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//--------------------------------------------------------------
router.put("/dislike", verifyAccessToken, async (req, res) => {
  try {
    //--validate all
    const { userId, postId } = req.body;
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!userId || !postId)
      return res.status(404).json({
        success: false,
        message: "Not found postId or/and userId",
      });
    if (userId !== jwt.decode(accessToken).userId)
      return res.status(403).json({
        success: false,
        message: "Invalid userId",
      });
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({
        success: false,
        message: "Not found post",
      });
    //---------------------------------------------
    if (!post.dislikes.includes(userId)) {
      //check user da liked trc do chua, neu r thi unliked
      if (post.likes.includes(userId)) {
        res.status(200).json({
          success: true,
          message: "disliked and unliked",
        });
        await post.updateOne({ $push: { dislikes: userId } });
        await post.updateOne({ $pull: { likes: userId } });
      } else {
        res.status(200).json({
          success: true,
          message: "disliked",
        });
        await post.updateOne({ $push: { dislikes: userId } });
      }
    } else {
      res.status(200).json({
        success: true,
        message: "undisliked",
      });
      await post.updateOne({ $pull: { dislikes: userId } });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
//--------------------------------------------------------------
router.get("/get_all", async (req, res) => {
  try {
    const posts = await Post.find();
    const users = await User.find();
    res.status(200).json({ success: true, posts, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.post("/upload", upload.single("avatar"), async (req, res) => {
  const image = req.file;
  if (!image) {
    return res.status(404).json({ success: false, message: "Not found image" });
  }
  res.send(image);
});
//--------------------------------------------------------------
export default router;
