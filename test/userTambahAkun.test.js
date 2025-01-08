const request = require("supertest");
const express = require("express");
const router = require("../routes/userAkun"); // Sesuaikan dengan lokasi file router Anda
const db = require("../database/db");

// Mock Express app
const app = express();
app.use(express.json());
app.use(router);

// Mock database
jest.mock("../database/db", () => {
  return {
    query: jest.fn(),
  };
});

describe("POST /signup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should successfully add a user", async () => {
    // Mock database query for INSERT INTO
    db.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app)
      .post("/signup")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User registered successfully");
  });

  test("should return error when database fails", async () => {
    // Mock database query to return an error
    db.query.mockImplementation((query, values, callback) => {
      callback(new Error("Database error"), null);
    });

    const response = await request(app)
      .post("/signup")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Error registering user");
  });

  test("should return error when password hashing fails", async () => {
    // Mock bcrypt.hash to return an error
    jest.spyOn(require("bcryptjs"), "hash").mockImplementation((password, salt, callback) => {
      callback(new Error("Hashing error"), null);
    });

    const response = await request(app)
      .post("/signup")
      .send({ username: "testuser", password: "testpassword" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Error hashing password");
  });
});
