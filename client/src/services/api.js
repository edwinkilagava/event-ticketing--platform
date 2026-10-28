
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5002/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "eventix_access_token";

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body = options.body;

  if (
    body !== undefined &&
    body !== null &&
    !(body instanceof FormData)
  ) {
    if (typeof body !== "string") {
      body = JSON.stringify(body);
    }

    headers.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${normalizedPath}`,
      {
        ...options,
        headers,
        body,
      },
    );
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      "Unable to connect to Eventix. Please try again.",
      0,
    );
  }

  if (response.status === 204) {
    return null;
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
    );
  }

  if (!response.ok || result?.success === false) {
    throw new ApiError(
      result?.message || "The request could not be completed.",
      response.status,
      result,
    );
  }

  return result;
}
