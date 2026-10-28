
import "dotenv/config";

import app from "./app.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/db.js";

const PORT = Number(process.env.PORT) || 5000;

let server;
let isShuttingDown = false;

async function startServer() {
  await connectDatabase();

  server = app.listen(PORT, () => {
    console.log(`Eventix API running on port ${PORT}.`);
    console.log(
      `Environment: ${process.env.NODE_ENV || "development"}`,
    );
  });
}

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Shutting down Eventix...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await disconnectDatabase();
    process.exitCode = 0;
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exitCode = 1;
  }
}

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

startServer().catch((error) => {
  console.error("Failed to start Eventix:", error.message);
  process.exitCode = 1;
});
