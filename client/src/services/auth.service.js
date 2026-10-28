
import { apiRequest } from "./api.js";

const TOKEN_KEY = "eventix_access_token";

export function saveAccessToken(token) {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("A valid access token is required.");
  }

  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function hasAccessToken() {
  return Boolean(sessionStorage.getItem(TOKEN_KEY));
}

export async function registerUser({ name, email, password }) {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

  const result = response.data;

  if (!result?.accessToken || !result?.user) {
    throw new Error(
      "The server returned an invalid registration response.",
    );
  }

  saveAccessToken(result.accessToken);

  return result.user;
}

export async function loginUser({ email, password }) {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const result = response.data;

  if (!result?.accessToken || !result?.user) {
    throw new Error(
      "The server returned an invalid login response.",
    );
  }

  saveAccessToken(result.accessToken);

  return result.user;
}

export async function getCurrentUser() {
  if (!hasAccessToken()) {
    return null;
  }

  const response = await apiRequest("/auth/me");
  const user = response.data?.user;

  if (!user) {
    throw new Error(
      "The server returned an invalid user response.",
    );
  }

  return user;
}

export async function logoutUser() {
  // The backend currently has no logout endpoint.
  // JWT authentication is stateless, so clear the local token.
  clearAccessToken();
}
