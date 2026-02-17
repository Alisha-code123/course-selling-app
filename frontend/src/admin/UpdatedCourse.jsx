import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Course fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // File object or null
  const [imagePreview, setImagePreview] = useState(""); // URL for display
  const [loading, setLoading] = useState(true);

  // Fetch existing course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(
          `${ BACKEND_URL }/course/${id}`,
          { withCredentials: true }
        );

        const course = data.course;

        setTitle(course?.title || "");
        setDescription(course?.description || "");
        setPrice(course?.price || "");

        // Preview image for display
        const imageUrl =
          typeof course?.image === "string"
            ? course.image
            : course?.image?.url || "/imgPL.webp";

        setImagePreview(imageUrl);
        setImage(null); // do NOT set URL as image File

        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  // Handle file selection
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result); // show preview
        setImage(file); // store file for upload
      };
    }
  };

  // Handle update
  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!title || !description || !price) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);

    // Only append actual file
    if (image && image instanceof File) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("admin");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.put(
        `${ BACKEND_URL }/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course updated successfully");

      // Reset fields
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview("");

      navigate("/admin/our-courses");
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.errors || "Failed to update course";
      toast.error(message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-8">Update Course</h3>
        <form onSubmit={handleUpdateCourse} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-lg">Description</label>
            <input
              type="text"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-lg">Price</label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              required
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-lg">Course Image</label>
            <div className="flex items-center justify-center mb-2">
              <img
                src={imagePreview || "/imgPL.webp"}
                alt="Course"
                className="w-full max-w-sm h-auto rounded-md object-cover"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
