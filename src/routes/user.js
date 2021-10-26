import express from "express";
import Post from "../models/Post.js";
const router = express.Router();
import User from "../models/User.js";
//--------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
router.get("/find_one", async (req, res) => {
  const { user_id } = req.query; //get from URL ************
  if (user_id) {
    try {
      const user = await User.findOne({ _id: user_id });
      user.posts = await Post.find({ userId: user_id });
      res.json({ success: true, user });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    res.status(404).json({ success: false, message: "Not found user" });
  }
});
//--------------------------------------------------------------
export default router;
