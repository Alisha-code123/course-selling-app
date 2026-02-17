import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,     // ✅ String
      required: true,
      unique: true,     // ✅ correct key
    },
    password: {
      type: String,
      required: true,
    },
  },
);

export const Admin = mongoose.model("Admin", adminSchema);
