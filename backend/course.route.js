import express from "express";
import {
  buyCourses,
  courseDetails,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "./controllers/course.controller.js";

import userMiddleware from "./middleware/user.mid.js";
import adminMiddleware from "./middleware/admin.mid.js";

const router = express.Router();

// ADMIN
router.post("/create", adminMiddleware, createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

// USER / PUBLIC
router.get("/courses", getCourses);
router.post("/buy/:courseId", userMiddleware, buyCourses);

// ⚠️ ALWAYS LAST
router.get("/:courseId", courseDetails);

export default router;
