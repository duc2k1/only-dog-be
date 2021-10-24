import express from "express";
const router = express.Router();
import verifyToken from "../middleware/auth.js";
import User from "../models/User.js";
import db from "mongoose";
//--------------------------------------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
//--------------------------------------------------------------
//User Suggestions
router.get("/user-suggestions", verifyToken, async (req, res) => {
  const usersSortByFollower = await User.aggregate([
    {
      $addFields: {
        countFollower: {
          $size: "$followers",
        },
      },
    },
    {
      $sort: {
        countFollower: -1,
      },
    },
  ]);
  //suggestion user
  const users = await User.find({}).select("-password");
  res.json({ success: true, users });
});

//--------------------------------------------------------------

//--------------------------------------------------------------

//--------------------------------------------------------------

//--------------------------------------------------------------

export default router;
