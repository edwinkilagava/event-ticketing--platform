
import mongoose from "mongoose";

export function getHealth(req, res) {
  const databaseConnected = mongoose.connection.readyState === 1;

  return res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "Eventix API is healthy."
      : "Eventix API is running, but the database is unavailable.",
    data: {
      database: databaseConnected ? "connected" : "disconnected",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
}
