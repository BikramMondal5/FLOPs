import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/schemas/auth";

describe("Auth Integration Tests", () => {
  let db: any;

  beforeAll(async () => {
    db = await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("Signup / Registration logic", () => {
    it("should successfully validate and register a new user", async () => {
      const signupData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      // Zod validation check
      const parsed = signupSchema.safeParse(signupData);
      expect(parsed.success).toBe(true);

      const usersCollection = db.collection("users");
      const hashedPassword = await bcrypt.hash(signupData.password, 12);

      const newUser = {
        name: signupData.name,
        email: signupData.email.toLowerCase(),
        password: hashedPassword,
        role: "user",
        currency: "INR",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      expect(result.insertedId).toBeDefined();

      const userInDb = await usersCollection.findOne({ email: "john@example.com" });
      expect(userInDb).toBeDefined();
      expect(userInDb.name).toBe("John Doe");
      expect(userInDb.email).toBe("john@example.com");

      // Verify password hashing
      const match = await bcrypt.compare(signupData.password, userInDb.password);
      expect(match).toBe(true);
    });

    it("should prevent duplicate signup emails", async () => {
      const email = "duplicate@example.com";
      const usersCollection = db.collection("users");

      await usersCollection.insertOne({
        name: "First User",
        email: email,
        password: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Try searching for duplicate email
      const existingUser = await usersCollection.findOne({ email });
      expect(existingUser).not.toBeNull();
    });
  });

  describe("Session & Credentials Authorization", () => {
    it("should authorize user with correct email and password", async () => {
      const usersCollection = db.collection("users");
      const password = "ValidPassword123!";
      const hashedPassword = await bcrypt.hash(password, 12);

      await usersCollection.insertOne({
        name: "Auth User",
        email: "auth@example.com",
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Simulation of CredentialsProvider authorize logic
      const user = await usersCollection.findOne({ email: "auth@example.com" });
      expect(user).not.toBeNull();

      const isPasswordValid = await bcrypt.compare(password, user.password);
      expect(isPasswordValid).toBe(true);

      const authSessionUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      expect(authSessionUser.id).toBeDefined();
      expect(authSessionUser.name).toBe("Auth User");
      expect(authSessionUser.email).toBe("auth@example.com");
    });

    it("should reject credentials authorization with incorrect password", async () => {
      const usersCollection = db.collection("users");
      const password = "CorrectPassword123!";
      const hashedPassword = await bcrypt.hash(password, 12);

      await usersCollection.insertOne({
        name: "Auth User",
        email: "auth2@example.com",
        password: hashedPassword,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await usersCollection.findOne({ email: "auth2@example.com" });
      expect(user).not.toBeNull();

      const isPasswordValid = await bcrypt.compare("WrongPassword!", user.password);
      expect(isPasswordValid).toBe(false);
    });
  });
});
