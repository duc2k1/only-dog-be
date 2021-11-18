import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import serverError from "../errors/serverError.js";
//--------------------------------------------------------------
dotenv.config();
//--------------------------------------------------------------
export default function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken)
      return res
        .status(401)
        .json({ success: false, message: "Access token not found" });
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    serverError(res);
  }
}
