import express from "express";
import mongoose from "mongoose";
import healthRoute from "./routes/health.route.js";

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

app.listen(3000, () => {
  console.log("Server is listening on port 3000 !");
});

app.use("health", healthRoute);

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
