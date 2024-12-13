import express from 'express'
import cors from "cors";
import session from "express-session";
import "dotenv/config";


const app = express()

app.use(cors({
                 credentials: true,
                 origin: process.env.NETLIFY_URL || "http://localhost:3000",
             }
));
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));
app.use(express.json());

app.listen(process.env.PORT || 4001)