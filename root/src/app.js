import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
import shrinkRouter from "./routes/shrinkRouter.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import logout from "./utils/logout.js";
import { refreshAccess } from "./utils/refreshAccess.js";
const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://127.0.0.1:5000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
      "http://192.168.46.130:3000",
      "https://shrinkifyfrontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
// app.use("/shrink", (req, res, next) => {
//   console.log(req.body.length);
//   next();
// });
app.use("/refresh", refreshAccess);
app.use("/logout", logout);
app.use("/auth", authRouter);
app.use("/shrink", shrinkRouter);

app.use(errorHandler);

export default app;
