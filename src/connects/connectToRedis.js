import dotenv from "dotenv";
import redis from "redis";
//-------------------------------------------------
dotenv.config();
//-------------------------------------------------
export const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PASSWORD,
});
export function redisStatus() {
  redisClient.on("error", (error) => {
    console.error(`❗️ Redis Error: ${error}`);
    process.exit(1);
  });
  redisClient.on("ready", () => {
    console.log(
      `✅ Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    );
  });
}
