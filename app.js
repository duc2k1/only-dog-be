console.clear();
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import connectToMongoDb from "./src/connects/connectToMongoDb.js";
import {
  redisStatus
} from "./src/connects/connectToRedis.js";
import authRouter from "./src/routes/auth.js";
import postRouter from "./src/routes/post.js";
import userRouter from "./src/routes/user.js";
//--------------------------------------------------------------
const app = express();
const PORT = process.env.PORT;
dotenv.config();
const __dirname = path.resolve();
//--------------------------------------------------------------
connectToMongoDb();
redisStatus();
//--------------------------------------------------------------
// https://onlydog.social
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/images", express.static(__dirname + "/assets/images"));
app.use("/default_avatar", express.static(__dirname + "/assets"));
//--------------------------------------------------------------
app.get("/*", (req, res) => {
  res.status(404).send("<h1>404</h1>");
});
//--------------------------------------------------------------
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

sslServer.listen(PORT, () =>
  console.log(`✅ Server: https://localhost:${PORT}`)
);