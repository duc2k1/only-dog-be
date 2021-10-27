import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./src/routes/auth.js";
import postRouter from "./src/routes/post.js";
import userRouter from "./src/routes/user.js";
import helmet from "helmet";
import dotenv from "dotenv";
import redis from "redis";
//--------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5500;
dotenv.config();
//--------------------------------------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();
//--------------------------------------------------------------
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);
//--------------------------------------------------------------
//cors
app.use(cors());
//redis
const redisClient = redis.createClient({
  host: "apn1-brave-oryx-30883.upstash.io",
  port: 30883,
  password: "88104c06b1244bfa9e60616f3e12897b",
});
redisClient.on("ready", function() {  
  console.log("Connected to Redis server successfully");  
});
const set = (key, value) => {
  redisClient.set(key, JSON.stringify(value));
};
const get = (req, res, next) => {
  let key = req.route.path;
  redisClient.get(key, (error, data) => {
    if (error) res.status(400).send(err);
    if (data !== null) {
      res.status(200).send(JSON.parse(data));
    } else next();
  });
//--------------------------------------------------------------
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
