
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { getActiveUserById } from "../services/auth.service.js";

const JWT_ISSUER = "eventix-api";
const JWT_AUDIENCE = "eventix-client";

function sendUnauthorized(res, message) {
  return res.status(401).json({
    success: false,
    message,
  });
}

export default async function authenticate(req, res, next) {
  try {
    const authorization = req.get("authorization");
    const match = authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return sendUnauthorized(
        res,
        "Please sign in to continue.",
      );
    }

    const secret = process.env.JWT_SECRET;

    if (
      !secret ||
      Buffer.byteLength(secret, "utf8") < 32
    ) {
      throw new Error(
        "JWT_SECRET must contain at least 32 bytes.",
      );
    }

    const decoded = jwt.verify(match[1], secret, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (
      typeof decoded.sub !== "string" ||
      !mongoose.isValidObjectId(decoded.sub)
    ) {
      return sendUnauthorized(
        res,
        "Invalid authentication token.",
      );
    }

    req.user = await getActiveUserById(decoded.sub);

    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return sendUnauthorized(
        res,
        "Your session is invalid or has expired. Please sign in again.",
      );
    }

    return next(error);
  }
}
