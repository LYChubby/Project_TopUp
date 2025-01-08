const request = require("supertest");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const db = require("../database/db"); // Ganti dengan path ke file db Anda
const app = express();

// Setup Express app seperti di dalam aplikasi utama Anda
app.use(express.json());
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
}));

// Import router
const router = require("../routes/userAkun"); // Ganti dengan path ke router Anda
app.use(router);

// Mock database query
jest.mock("../database/db", () => ({
  query: jest.fn(),
}));

// Mulai tes login
describe("POST /login", () => {

  // Tes login dengan username dan password yang benar
  test("should login successfully with correct credentials", async () => {
    const mockUser = {
      id: 1,
      username: "admin",
      password: await bcrypt.hash("admin", 10), // Hash password yang benar
    };

    db.query.mockImplementationOnce((query, values, callback) => {
      if (query === "SELECT * FROM users WHERE username = ?") {
        return callback(null, [mockUser]); // Simulasi menemukan user
      }
      callback(new Error("Query error"));
    });

    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "admin" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful");
  });

  // Tes login dengan username yang salah
  test("should return 400 if user is not found", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      if (query === "SELECT * FROM users WHERE username = ?") {
        return callback(null, []); // Tidak ada user ditemukan
      }
      callback(new Error("Query error"));
    });

    const response = await request(app)
      .post("/login")
      .send({ username: "nonexistent", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  // Tes login dengan password yang salah
  test("should return 401 if password is incorrect", async () => {
    const mockUser = {
      id: 1,
      username: "admin",
      password: await bcrypt.hash("admin", 10),
    };

    db.query.mockImplementationOnce((query, values, callback) => {
      if (query === "SELECT * FROM users WHERE username = ?") {
        return callback(null, [mockUser]); // Temukan user
      }
      callback(new Error("Query error"));
    });

    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Incorrect password");
  });
});
