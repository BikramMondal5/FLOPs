import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { POST } from "@/app/api/auth/register/route";
import request from "supertest";

describe("API Route: Auth / Register", () => {
  let db: any;
  let server: any;

  beforeAll(async () => {
    db = await connect();
    server = createRouteServer({ POST });
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it("POST /api/auth/register - should create a new user and return 201", async () => {
    const payload = {
      name: "New User",
      email: "newuser@example.com",
      password: "SecurePassword123!",
    };

    const res = await request(server)
      .post("/api/auth/register")
      .send(payload)
      .expect(201);

    expect(res.body.message).toContain("created successfully");
    expect(res.body.user.email).toBe("newuser@example.com");
  });

  it("POST /api/auth/register - should return 400 on malformed input", async () => {
    const payload = {
      email: "invalid-email",
    };

    const res = await request(server)
      .post("/api/auth/register")
      .send(payload)
      .expect(400);

    expect(res.body.error).toBe("Validation failed");
  });
});
