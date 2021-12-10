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
    test("should be have status code 200 because userId exist", async () => {
      const userId = "61a7741deb9b602341992fa2";
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    }, 10000);
  });

  describe("not good", () => {
    test("should be have status code 500 because userId not exist", async () => {
      const userId = "12341234";
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    },10000);

    test("should be have status code 500 because userId not found", async () => {
      const userId = "61ad7c4512a364daa5e043e3";
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    },10000);

    test("should be have status code 500 because userId is integer number", async () => {
      const userId = 1234;
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    },10000);

    test("should be have status code 500 because userId is negative number", async () => {
      const userId = -1234;
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    },10000);

    test("should be have status code 500 because userId is float number", async () => {
      const userId = 1.24;
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    },10000);

    test("should be have status code 500 because userId is null", async () => {
      const userId = null;
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    test("should be have status code 500 because userId is  random string", async () => {
      const userId = "abcedre";
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    test("should be have status code 500 because userId is boolean", async () => {
      const userId = true;
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    test("should be have status code 500 because userId is array", async () => {
      const userId = ["1", "2", "3"];
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    test("should be have status code 500 because userId is undefined ", async () => {
      const userId = undefined;
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    test("should be have status code 404 because userId is empty string ", async () => {
      const userId = "";
      const res = await request(app).get(`/users/find_by_id/${userId}`);
      expect(res.statusCode).toBe(404);
    });

    test("should be have status code 404 because without userId ", async () => {
      const res = await request(app).get(`/users/find_by_id/`);
      expect(res.statusCode).toBe(404);
    });
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
