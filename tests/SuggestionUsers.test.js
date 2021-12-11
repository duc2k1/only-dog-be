import app from "../app";
import request from "supertest";
import dotenv from "dotenv";

dotenv.config();
//before test

import mongoose from "mongoose";
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
});

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: `);
});

describe("/get_all", () => {
  describe("OK", () => {
    test("status code 200 and respone json user", async () => {
      const res = await request(app).get(`/users/get_all`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users).not.toContain("password");
      // expect(res.body.users).toEqual(
      //   expect.arrayContaining([expect.objectContaining("password")])
      // );
    }, 10000);
  });

  describe("not good", () => {
 
    test("status code 404 and message Page not found because endpoint not vaild", async () => {
      const res = await request(app).get(`/users/get_all/abc@@@`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Page not found");
    }, 10000);

    test("status code 404 and message Page not found because endpoint have special character", async () => {
      const res = await request(app).get(`/users/get_allabc@@@`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Page not found");
    }, 10000);
  });

  //after test
  afterAll(async () => {
    try {
      // await mongoose.connection.close();
    } catch (err) {
      console.log(err);
    }
  });
});
