
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const BCRYPT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JWT_ISSUER = "eventix-api";
const JWT_AUDIENCE = "eventix-client";

function createAuthError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return typeof email === "string"
    ? email.trim().toLowerCase()
    : "";
}

function validatePassword(password) {
  if (typeof password !== "string") {
    throw createAuthError("Password is required.", 400);
  }

  const byteLength = Buffer.byteLength(password, "utf8");

  if (byteLength < 8 || byteLength > 72) {
    throw createAuthError(
      "Password must be between 8 and 72 UTF-8 bytes.",
      400,
    );
  }
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 bytes.",
    );
  }

  return secret;
}

function createAccessToken(userId) {
  return jwt.sign({}, getJwtSecret(), {
    subject: userId.toString(),
    expiresIn: process.env.JWT_ACCESS_TOKEN_TTL || "15m",
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithm: "HS256",
  });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export async function registerLocalUser({
  name,
  email,
  password,
}) {
  if (typeof name !== "string") {
    throw createAuthError("Name is required.", 400);
  }

  name = name.trim();
  email = normalizeEmail(email);

  if (name.length < 2 || name.length > 100) {
    throw createAuthError(
      "Name must contain between 2 and 100 characters.",
      400,
    );
  }

  if (
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    throw createAuthError(
      "Enter a valid email address.",
      400,
    );
  }

  validatePassword(password);

  const existingUser = await User.exists({ email });

  if (existingUser) {
    throw createAuthError(
      "An account with this email already exists.",
      409,
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    BCRYPT_ROUNDS,
  );

  let user;

  try {
    user = await User.create({
      name,
      email,
      passwordHash,
      role: "organizer",
      isActive: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw createAuthError(
        "An account with this email already exists.",
        409,
      );
    }

    throw error;
  }

  return {
    accessToken: createAccessToken(user._id),
    user: publicUser(user),
  };
}

export async function verifyLocalCredentials({
  email,
  password,
}) {
  email = normalizeEmail(email);

  if (
    !email ||
    typeof password !== "string" ||
    !password
  ) {
    throw createAuthError(
      "Email and password are required.",
      400,
    );
  }

  const user = await User.findOne({ email })
    .select("+passwordHash");

  if (!user || !user.passwordHash) {
    throw createAuthError(
      "Invalid email or password.",
      401,
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw createAuthError(
      "Invalid email or password.",
      401,
    );
  }

  if (!user.isActive) {
    throw createAuthError(
      "This account is not currently active.",
      403,
    );
  }

  return {
    accessToken: createAccessToken(user._id),
    user: publicUser(user),
  };
}

export async function getActiveUserById(userId) {
  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw createAuthError(
      "Your account is not available. Please sign in again.",
      401,
    );
  }

  return publicUser(user);
}
