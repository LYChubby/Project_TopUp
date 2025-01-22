const request = require("supertest");
const express = require("express");
const router = require("../routes/mobilelegenddb"); // Path ke file route Anda

const app = express();
app.use(express.json()); // Parsing JSON request body
app.use("/mobilelegend", router); // Menggunakan router yang akan diuji

// Mock koneksi database
jest.mock("../database/db", () => {
  const mockDb = {
    query: jest.fn(),
  };
  return mockDb;
});
const db = require("../database/db");

describe("CRUD operations on /mobilelegenddb route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /mobilelegend - Get all data", async () => {
    const mockData = [
      { id: 1, name: "Diamond Pack", price: 500, type: "diamond", image_url: "url1" },
      { id: 2, name: "Gold Pack", price: 300, type: "gold", image_url: "url2" },
    ];
    db.query.mockImplementation((sql, callback) => {
      callback(null, mockData);
    });

    const response = await request(app).get("/mobilelegend");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test("GET /mobilelegend/data/:id - Get data by ID", async () => {
    const mockData = { id: 1, name: "Diamond Pack", price: 500, type: "diamond", image_url: "url1" };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [mockData]);
    });

    const response = await request(app).get("/mobilelegend/data/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test("POST /mobilelegend/tambah - Add new data", async () => {
    const newData = {
      name: "Silver Pack",
      price: 200,
      type: "silver",
      image_url: "url3",
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { insertId: 3 });
    });

    const response = await request(app).post("/mobilelegend/tambah").send(newData);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 3,
      ...newData,
    });
  });

  test("PUT /mobilelegend/update/:id - Update data", async () => {
    const updatedData = {
      name: "Updated Pack",
      price: 1000,
      type: "updated",
      image_url: "updated_url",
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put("/mobilelegend/update/1").send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "1",
      ...updatedData,
    });
  });

  test("DELETE /mobilelegend/delete/:id - Delete data", async () => {
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete("/mobilelegend/delete/1");
    expect(response.status).toBe(204);
  });

  test("GET /mobilelegend/data/:id - Data not found", async () => {
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, []);
    });

    const response = await request(app).get("/mobilelegend/data/99");
    expect(response.status).toBe(404);
    expect(response.text).toBe("Data tidak ditemukan");
  });
});
