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
//use for profile user
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
//user_id: user current (userId) => send from body
//user_id_follow: user has followed by another one
router.put("/follow", async (req, res) => {
  const user_id = req.body.userId;
  const user_id_follow = req.query.user_id_follow;
  if (user_id_follow) {
    if (req.body.userId !== req.query.user_id_follow) {
      try {
        const user = await User.findById(user_id_follow);
        const currentUser = await User.findById(user_id);
        //check followers list
        if (!user.followers.includes(user_id)) {
          await user.updateOne({ $push: { followers: user_id } });
          await currentUser.updateOne({ $push: { following: user_id_follow } });
          res.status(200).json("User was followed");
        } else {
          res.status(403).json("You allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can't follow yourself");
    }
  } else {
    res.status(404).json({ success: false, message: "Not found user" });
  }
});
//--------------------------------------------------------------

export default router;
