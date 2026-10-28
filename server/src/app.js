
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import healthRouter from "./routes/health.routes.js";
import categoryRouter from "./routes/category.routes.js";
import authRouter from "./routes/auth.routes.js";
import requestId from "./middleware/requestId.middleware.js";
import eventRouter from "./routes/event.routes.js";
import adminRouter from "./routes/admin.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is missing from the environment.");
}

app.disable("x-powered-by");

app.use(requestId);

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Eventix API.",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", eventRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
