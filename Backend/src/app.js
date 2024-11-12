import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();
const app = express();


app.use(express.json({ limit: "16kb" })); // to parse json in body
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to parse url
app.use(express.static("public")); // to use static public folder
app.use(cookieParser()); // to enable CRUD operation on browser cookies

// Passport middleware
app.use(passport.initialize());
app.use(express.static('Frontend/dist'));

// Importing routes
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import requestRouter from "./routes/request.routes.js";
import reportRouter from "./routes/report.routes.js";
import ratingRouter from "./routes/rating.routes.js";

// Using routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/request", requestRouter);
app.use("/report", reportRouter);
app.use("/rating", ratingRouter);
app.get('*', (req, res) => {
  res.sendFile(path.resolve('Frontend', 'dist', 'index.html'));
});

export { app };
