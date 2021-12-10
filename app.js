import express from "express";

import cors from "cors";
import helmet from "helmet";
import authRouter from "./src/routes/auth.js";
import postRouter from "./src/routes/post.js";
import userRouter from "./src/routes/user.js";
import path from "path";
//--------------------------------------------------------------
const app = express();

const __dirname = path.resolve();
//--------------------------------------------------------------

//--------------------------------------------------------------
// https://onlydog.social

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/images", express.static(__dirname + "/src/images"));
app.use("/default_avatar", express.static(__dirname + "/src"));

//--------------------------------------------------------------
app.get("*", (req, res) => {
  res.status(404).send("<h1>404</h1>");
});
//--------------------------------------------------------------
export default app;
