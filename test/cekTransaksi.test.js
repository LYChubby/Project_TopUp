const request = require("supertest");
const app = require("../app");

describe("GET /cektransaksi", () => {
  it("should return status 200 and render the cek transaksi page", async () => {
    const response = await request(app).get("/cektransaksi");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Cek Invoice Kamu Dengan Mudah Dan Cepat");
    expect(response.text).toContain('<div class="cekTransaksi">');
  });

  it("should return 404 for a non-existent route", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.status).toBe(404);
  });
});
