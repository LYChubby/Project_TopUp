const request = require("supertest");
const express = require("express");
const router = require("../routes/valorantdb"); // Path ke file route Anda
const app = express();

app.use(express.json()); // Parsing JSON request body
app.use("/valorant", router); // Menggunakan router untuk endpoint

describe("Valorant API", () => {
  let createdId;

  // Test GET all data
  test("GET /valorant - should return all data", async () => {
    const response = await request(app).get("/valorant");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test POST to add new data
  test("POST /valorant/tambah - should add a new data", async () => {
    const newData = { vp: 100, harga: 5000 };
    const response = await request(app)
      .post("/valorant/tambah")
      .send(newData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Data added successfully");
    expect(response.body.id).toBeDefined();
    createdId = response.body.id; // Save the id of the created record for further tests
  });

  // Test GET by ID
  test("GET /valorant/data/:id - should return data by id", async () => {
    const response = await request(app).get(`/valorant/data/${createdId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdId);
    expect(response.body).toHaveProperty("vp");
    expect(response.body).toHaveProperty("harga");
  });

  // Test PUT to update data
  test("PUT /valorant/update/:id - should update data", async () => {
    const updatedData = { vp: 150, harga: 6000 };
    const response = await request(app)
      .put(`/valorant/update/${createdId}`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Data updated successfully");
  });

  // Test DELETE to remove data
  test("DELETE /valorant/delete/:id - should delete data", async () => {
    const response = await request(app).delete(`/valorant/delete/${createdId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Data deleted successfully");
  });

  // Test GET by ID for a non-existing entry
  test("GET /valorant/data/:id - should return 404 for non-existing id", async () => {
    const response = await request(app).get("/valorant/data/999999"); // ID yang tidak ada
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Card not found");
  });
});
