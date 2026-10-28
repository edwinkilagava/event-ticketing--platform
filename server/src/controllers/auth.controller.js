
import {
  registerLocalUser,
  verifyLocalCredentials,
  getActiveUserById,
} from "../services/auth.service.js";

export async function register(req, res) {
  const result = await registerLocalUser(req.body);

  return res.status(201).json({
    success: true,
    message: "Your Eventix account has been created.",
    data: result,
  });
}

export async function login(req, res) {
  console.log("Eventix login request diagnostics:", {
    method: req.method,
    path: req.originalUrl,
    contentType: req.headers["content-type"],
    bodyReceived: req.body !== undefined,
    bodyType: typeof req.body,
    bodyKeys:
      req.body && typeof req.body === "object"
        ? Object.keys(req.body)
        : [],
  });

  const result = await verifyLocalCredentials(req.body);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: result,
  });
}

export async function getCurrentUser(req, res) {
  const user = await getActiveUserById(req.user.id);

  return res.status(200).json({
    success: true,
    data: { user },
  });
}
