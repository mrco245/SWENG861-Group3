import express from "express";
import mongoose from "mongoose";
import healthRoute from "./routes/health.route.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { swaggerOptions } from './config/swagger.js';
import cors from 'cors'

import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { config } from "./config/config.js";

if (process.env.NODE_ENV !== 'test') {
mongoose
  .connect(config.MONGODB_URI, {dbName: 'sweng861-group3'})
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

app.listen(3000, () => {
  console.log("Server is listening on port 3000 !");
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/healthz", healthRoute);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
