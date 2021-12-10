import app from "../app";
import request from "supertest";
import dotenv from "dotenv";
import jasmine from "jest";
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

describe("Get /profileUser", () => {
  describe("OK", () => {
    test("should be have status code 200 because refreshToken ", async () => {
      const refreshToken = "61a7741deb9b602341992fa2";
      const res = await request(app).get(`/auth/refresh_access_token`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    }, 10000);
  });

  describe("not good", () => {
   
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
