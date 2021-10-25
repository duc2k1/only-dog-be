import express from "express";
import multer from "multer";
import verifyToken from "../middleware/auth.js";
import Post from "../models/Post.js";
//--------------------------------------------------------------
const router = express.Router();
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
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.post("/", async (req, res) => {
  const {
    userId = "6176bdf8dbfbe566dd2172a2",
    pathImage = "",
    likes = [],
    dislikes = [],
  } = req.body;
  try {
    const newPost = new Post({
      userId,
      pathImage,
      likes,
      dislikes,
    });
    await newPost.save();
    res.json({ success: true, post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  async (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
  }
);
export default router;
