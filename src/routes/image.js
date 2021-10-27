import express from "express";
import multer from "multer";
import verifyToken from "../middlewares/auth.js";
import Post from "../models/Post.js";
//--------------------------------------------------------------
const router = express.Router();
//--------------------------------------------------------------
const storagePostImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/posts/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storagePostImage });
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
router.post("/add-post",upload.single("pathImage"), async (req, res) => {
  const {
    userId,
    pathImage,
  } = req.body;
  try {
    const newPost = new Post({
      userId,
      pathImage,
    });
    await newPost.save();
    console.log(newPost);
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
//--------------------------------------------------------------
router.put("/:id/dislike", verifyToken, async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(!post.dislikes.includes(req.body.userId))
    {
      await post.updateOne({$push:{dislikes:req.body.userId}});
      res.status(200).json("The post was disliked");
    }else{
      await post.updateOne({$pull:{dislikes:req.body.userId}});
      res.status(200).json("The post was undisliked");
    }
  }catch (err){
    res.status(500).json(err);
  }
});
export default router;
