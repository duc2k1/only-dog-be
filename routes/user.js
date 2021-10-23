import express from "express";
import { get } from "lodash";
const router = express.Router();
import verifyToken from "../middleware/auth.js";
import User from "../models/User.js";
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


//--------------------------------------------------------------



//--------------------------------------------------------------



//--------------------------------------------------------------



//--------------------------------------------------------------

export default router;
