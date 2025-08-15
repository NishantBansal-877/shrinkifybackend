// import express from "express";
// import cookieParser from "cookie-parser";
// import morgan from "morgan";
// import cors from "cors";

// import authRouter from "./routes/authRouter.js";
// import shrinkRouter from "./routes/shrinkRouter.js";
// import errorHandler from "./middlewares/errorMiddleware.js";
// import logout from "./utils/logout.js";
// import { createAccessToken, verifyRefreshToken } from "./utils/jwt.js";

// const app = express();

// const allowedOrigins = [
//   "https://shrinkifyfrontend.vercel.app",
//   "https://shrinkifyfrontend.netlify.app",
//    "https://shrinkifyfrontend.vercel.app/",
//   "https://shrinkifyfrontend.netlify.app/"
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//   console.log(origin);
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true,
// }));

// app.use(cookieParser());
// app.use(express.json({ limit: "50mb" }));
// app.use(morgan("dev"));

// app.get("/",(req,res)=>{
// res.end("done");
// })

// app.get("/refresh", (req, res) => {
//   const payload = verifyRefreshToken(req);
//   if (!payload) {
//     return res.status(401).json({ message: "Invalid refresh token" });
//   }

//   payload._id = payload.sub;
//   createAccessToken(payload, res);
//   res.json({
//     message: "Refresh access done",
//     fullName: payload.fullName,
//     email: payload.email
//   });
// });

// app.use("/logout", logout);
// app.use("/auth", authRouter);
// app.use("/shrink", shrinkRouter);

// app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// app.use(errorHandler);

// export default app;
