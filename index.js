import express from 'express'
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js"
import dotenv from "dotenv";

dotenv.config();
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
const app = express()


app.use(cors({
                 credentials: true,
                 origin: "http://localhost:5173"// process.env.REMOTE_SERVER || fix this,
             }
));
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV === "production") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NETLIFY_URL,
    };
}
app.use(session(sessionOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes)

app.listen(4001)
