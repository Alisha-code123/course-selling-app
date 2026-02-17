import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as z from "zod";
import Purchase from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, res) => {
  const schema = z.object({
    firstName: z.string().min(3,{message:"firstName must be atleast 6 char long"}),
    lastName: z.string().min(3,{message:"lastName must be atleast 6 char long"}),
    email: z.string().email(),
    password: z.string().min(6,{message:"password must be atleast 9 char long"}),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        firstName,
        lastName,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id }, // MUST match middleware
      process.env.JWT_USER_PASSWORD,
      { expiresIn: "1d" }
    );

    const cookieOPtions={
      expires: new Date(Date.now() + 24*60 + 60 + 1000), //1day
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", //true for https only
      sameSite:"Strict",
    };

    
     res.cookie("jwt", token,cookieOPtions);

    // 5️⃣ Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ error: "Server error" });
  }
};



export const logout = (req, res) => {
  try {
    if(!req.cookies.jwt){
        return res.status(401).json({errors:"Kindly login first"});
    }
   
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in logout" });
    console.log("Error in logout", error);
  }
};


export const purchases = async (req, res)=>{
  const userId=req.userId;

  try {
       const purchased = await Purchase.find({userId});
       let purchasedCourseId =[]

       for(let i=0;i<purchased.length;i++){
        purchasedCourseId.push(purchased[i].courseId);
       }

       const courseData=await Course.find({
          _id:{$in:purchasedCourseId},
       });

       res.status(200).json({purchased,courseData});
  } catch (error) {
    res.status(500).json({errors:"Error in purchase"});
    console.log("Error in purchase",error);
    
  }
};


