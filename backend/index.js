// import dotenv from "dotenv";
// dotenv.config(); // MUST be at top

// import express from "express";
// import mongoose from "mongoose";
// import fileUpload from "express-fileupload";
// import cookieParser from "cookie-parser";
// import { v2 as cloudinary } from "cloudinary";
// import cors from "cors";

// import courseRouter from "./course.route.js";
// import userRoute from "./user.route.js";
// import adminRoute from "./admin.route.js";
// import orderRoutes from "./order.route.js";



// const app = express();

// app.use("/uploads", express.static("uploads"));

// // -------- MIDDLEWARE --------
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // -------- CLOUDINARY --------
// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret,
// });

// // -------- DATABASE --------
// const PORT = process.env.PORT || 3000;
// const DB_URI = process.env.MONGO_URI;

// try {
//   await mongoose.connect(DB_URI);
//   console.log("Connected to MongoDB");
// } catch (error) {
//   console.error("MongoDB connection error:", error);
// }

// // -------- ROUTES --------
// app.use("/api/v1/course", courseRouter);
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/order", orderRoutes);
// app.use("/api/v1/admin", adminRoute);

// // -------- SERVER --------
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




































import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import courseRouter from "./course.route.js";
import userRoute from "./user.route.js";
import adminRoute from "./admin.route.js";
import orderRoutes from "./order.route.js";

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// CLOUDINARY
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

// DATABASE (Vercel-safe)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
}

connectDB();

// ROUTES
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/admin", adminRoute);

// ❗ Export app instead of listening
export default app;
