import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./src/routes/authRouter.js";
import shrinkRouter from "./src/routes/shrinkRouter.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";
import logout from "./src/utils/logout.js";
import { createAccessToken, verifyRefreshToken } from "./src/utils/jwt.js";
const app = express();

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://shrinkifyfrontend.vercel.app",
  "https://shrinkifyfrontend.netlify.app",
  "https://shrinkifyfrontend.vercel.app/",
  "https://shrinkifyfrontend.netlify.app/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.end("done");
});

app.get("/refresh", (req, res) => {
  const payload = verifyRefreshToken(req);
  if (!payload) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  payload._id = payload.sub;
  createAccessToken(payload, res);
  res.json({
    message: "Refresh access done",
    fullName: payload.fullName,
    email: payload.email,
  });
});

app.get("/logout", logout);
app.use("/auth", authRouter);
app.use("/shrink", shrinkRouter);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "127.0.1.1", () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;
