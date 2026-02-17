import { Course } from "../models/course.model.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary'
import Purchase from '../models/purchase.model.js';

 export const createCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    // ✅ Normalize to array
    const images = Array.isArray(req.files.image)
      ? req.files.image
      : [req.files.image];

    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
    const uploadedImages = [];

    for (const img of images) {
      if (!allowedFormats.includes(img.mimetype)) {
        return res.status(400).json({
          errors: "Invalid file format. Only PNG, JPG, JPEG allowed",
        });
      }

      const cloudResponse = await cloudinary.uploader.upload(
        img.tempFilePath,
        { folder: "courses" }
      );

      if (!cloudResponse) {
        return res.status(400).json({ errors: "Cloudinary upload failed" });
      }

      uploadedImages.push({
        public_id: cloudResponse.public_id,
        url: cloudResponse.secure_url,
      });
    }

    const course = await Course.create({
      title,
      description,
      price: Number(price),
      images: uploadedImages, // 👈 MULTIPLE
      creatorId: adminId,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

 export const updateCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    // ✅ Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ errors: "Invalid courseId" });
    }

    const course = await Course.findOneAndUpdate({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({ errors: "can't update, created by other admin" });
    }

    let updatedImages = course.images; // keep old images by default

    // If new images are uploaded
    if (req.files && req.files.image) {
      const images = Array.isArray(req.files.image)
        ? req.files.image
        : [req.files.image];

      const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
      updatedImages = [];

      // Delete old images from Cloudinary
      for (const img of course.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // Upload new images
      for (const img of images) {
        if (!allowedFormats.includes(img.mimetype)) {
          return res.status(400).json({
            errors: "Invalid file format. Only PNG, JPG, JPEG allowed",
          });
        }

        const cloudResponse = await cloudinary.uploader.upload(
          img.tempFilePath,
          { folder: "courses" }
        );

        updatedImages.push({
          public_id: cloudResponse.public_id,
          url: cloudResponse.secure_url,
        });
      }
    }

    // Update course details
    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.price = price ? Number(price) : course.price;
    course.images = updatedImages;

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error in course updating:", error.message);
    res.status(500).json({ error: error.message });
  }
};

 export const deleteCourse=async(req, res)=>{
    const adminId=req.adminId;
    const {courseId}=req.params;
    try {
        const course=await Course.findOneAndDelete({
            _id:courseId,
            creatorId:adminId,
        });
        if(!course){
            return res.status(404).json({error:"can't delete, created by other admin"});
        }
        res.status(200).json({message:"Course deleted successfully"});
    } catch (error) {
        res.status(500).json({errors:"Error in course updating"});
        console.log("Errors in course updating", error);        
    }
 };

 export const getCourses=async(req, res)=>{
    try {
        const courses=await Course.find({});
        res.status(201).json({courses});
        
    } catch (error) {
        res.status(500).json({errors:"Error is getting courses"});
        console.log("error to get courses",error);     
    }
 };

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.log("Error in course details", error);
    res.status(500).json({ error: "Error getting course details" });
  }
};


import Stripe from "stripe";
import config from "../config.js";


const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  if (!userId) {
    return res.status(401).json({ errors: "Unauthorized" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({
      userId,
      courseId
    });

    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "User has already purchased this course" });
    }

    // Stripe payment
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

     res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("error in course buying", error);
    return res.status(500).json({ errors: "Error in course buying" });
  }
};
