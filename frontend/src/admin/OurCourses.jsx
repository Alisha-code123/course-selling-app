import React,{useEffect, useState} from 'react'
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';

function OurCourses () {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("admin");

  if(!token){
    toast.error("Please login to admin")
    Navigate("/admin/login")
  }
   useEffect(() => {
  if (!token) return; // don't fetch if not logged in

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${ BACKEND_URL }/course/courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCourses(res.data.courses || []);
    } catch (err) {
      console.log("error in fetchCourses", err);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, [token]);
  //delete courses
   const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${ BACKEND_URL }/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

   if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
        
               <img
                   src={course?.images?.[0]?.url || "https://via.placeholder.com/300"}
                   alt={course.title}
                   crossOrigin="anonymous"
                  className="rounded mb-4 w-full h-40 object-cover"/>
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="line-through text-gray-500">₹300</span>
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurCourses

