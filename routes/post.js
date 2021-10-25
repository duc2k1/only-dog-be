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
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "name",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.get("/all-post", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ success: true, posts });
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
//-------------------------------testttttttttttttttttttt-------------------------------
router.post("/", verifyToken, async (req, res) => {
  const { userId, numberOfLike, numberOfDislike } = req.body;
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  try {
    const pathImage = ""; /////save
    const newPost = new Post({
      userId,
      pathImage,
      numberOfLike,
      numberOfDislike,
    });
    await newPost.save();
    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  // validation
  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  try {
    let updatedPost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };
    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );
    // User not authorised to update post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    res.json({
      success: true,
      message: "Excellent progress!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);
    // User not authorised or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.put("/:id/like", verifyToken, async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
  
    if(!post.likes.includes(req.body.userId))
    {
      await post.updateOne({$push:{likes:req.body.userId}});
      res.status(200).json("The post was liked");
    }else{
      await post.updateOne({$pull:{likes:req.body.userId}});
      res.status(200).json("The post was unliked");
    }
  }catch (err){
    res.status(500).json(err);
  }
});
export default router;
