import express from "express";
import mongoose from "mongoose";
import healthRoute from "./routes/health.route.js";
import bmiRoute from "./routes/bmi.route.js";  // Import BMI routes
import lusca from "lusca";
import cors from 'cors'
import cookieParser from "cookie-parser";
import crypto from 'crypto'
import session from 'express-session'

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected to MongoDB !");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB !", err);
  });

const app = express();

app.use(express.json());

app.use(cookieParser());

const secret = crypto.randomBytes(32).toString('hex');


const sessionConfig = session({
  secret: String(secret),
  resave: false,
  saveUninitialized: false,
  name: 'sessid',
  cookie: {
    maxAge: parseInt(2400000), // Used for expiration time.
    sameSite: 'strict', // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties.
    httpOnly: true, // Mitigate the risk of a client side script accessing the cookie.
    secure: process.env.NODE_ENV === 'production' // Ensures the browser only sends the cookie over HTTPS in production.
  }
});

app.use(sessionConfig);

app.use(cors());

app.use(lusca.csrf())



app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Use health and BMI routes
app.use("/health", healthRoute);
app.use("/api/bmi", bmiRoute);  // Register the BMI routes

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000 !");
});