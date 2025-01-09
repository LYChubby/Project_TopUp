const request = require("supertest");
const app = require("../app");

describe("GET /leaderboard", () => {
    it("should return status 200 and render the leaderboard page", async () => {
        const response = await request(app).get("/leaderboard");
        expect(response.status).toBe(200);
        expect(response.text).toContain("Top 10 Pembelian Terbanyak Di POPCHISTORE");
        expect(response.text).toContain("<div class=\"cekLeaderboard\">"); 
      });
      

  it("should return 404 for a non-existent route", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.status).toBe(404);
  });
});
