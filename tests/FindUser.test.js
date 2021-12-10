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

describe("Get /find_by_name/:userName", () => {
  describe("OK", () => {
    test("should be have status code 200 because user exist", async () => {
      const userName = "shiba1";
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users).toHaveLength(1);
    }, 10000);
  });

  describe("not good", () => {
    test("should be have status code 200 but user json is empty array because user not exist", async () => {
      const userName = "abcdes";
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 200 but user json is empty because user name is integer number", async () => {
      const userName = 1234;
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 200 but user json is empty because userName is negative number", async () => {
      const userName = -1234;
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 400  because userName is float number was validated ", async () => {
      const userName = 1.24;
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 200 but user json is empty because userName is null", async () => {
      const userName = null;
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 200 but user json is empty because userName is  random string", async () => {
      const userName = "abcedre";
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 200 but user json is empty because userName is boolean", async () => {
      const userName = true;
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 400 because userName is array was validated", async () => {
      const userName = ["1", "2", "3"];
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 200 but user json is empty because userName is undefined ", async () => {
      const userName = undefined;
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toHaveLength(0);
    }, 10000);

    test("should be have status code 404 because userName is empty string ", async () => {
      const userName = "";
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(404);
    }, 10000);

    test("should be have status code 404 because without userName ", async () => {
      const res = await request(app).get(`/users/find_by_name/`);
      expect(res.statusCode).toBe(404);
    }, 10000);

    test("should be have status code 400 because  userName is special character", async () => {
      const userName = "@@@@@@@!@!#!$%#^";
      const res = await request(app).get(`/users/find_by_name/${userName}`);
      expect(res.statusCode).toBe(400);
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
