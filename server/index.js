import express from "express";
import mongoose from "mongoose";
import healthRoute from "./routes/health.route.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import fitnessRoutes from './routes/fitness.route.js'
import cookieParser from "cookie-parser";
import cors from 'cors'
import { config } from "./config/config.js";
import RateLimit from 'express-rate-limit'
import session from 'express-session'
import lusca from "lusca";

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(config.MONGODB_URI, { dbName: 'sweng861-group3' })
    .then(() => {
      console.log("Connected to MongoDB !");
    })
    .catch((err) => {
      console.log("Failed to connect to MongoDB !", err);
    });
}

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());

if (process.env.NODE_ENV !== 'test') {

  const sessionConfig = session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessid',
    cookie: {
      maxAge: parseInt(config.COOKIE_EXPIRESIN), // Used for expiration time.
      sameSite: 'strict', // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties.
      httpOnly: true, // Mitigate the risk of a client side script accessing the cookie.
      secure: process.env.NODE_ENV === 'production' // Ensures the browser only sends the cookie over HTTPS in production.
    }
  });

  app.use(sessionConfig);

  if (process.env.NODE_ENV === 'production') {
    var limiter = RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // max 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    // apply rate limiter to all requests
    app.use(limiter);
  }
}

app.use("/api/healthz", healthRoute);
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.use(lusca.csrf())
}

app.use("/api/user", userRoutes);
app.use("/api/fitness", fitnessRoutes);

app.listen(3000, () => {
  console.log("Server is listening on port 3000 !");
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

