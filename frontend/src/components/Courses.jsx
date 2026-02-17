import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../public/logo.webp";
import { BACKEND_URL } from "../utils/utils";


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(res.data.courses || []);
      } catch (err) {
        console.log("error in fetchCourses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Mobile menu */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 z-10 transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0">
          <img src={logo} alt="Logo" className="rounded-full h-12 w-12" />
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>

            <li className="mb-4 text-blue-500 flex items-center">
              <FaDiscourse className="mr-2" /> Courses
            </li>

            <li className="mb-4">
              <Link to="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>

            <li className="mb-4">
              <a href="#" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </a>
            </li>

            <li>
              {isLoggedIn ? (
                <Link to="/" className="flex items-center" onClick={handleLogout}>
                  <IoLogOut className="mr-2" /> Logout
                </Link>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-64 w-full bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold">Courses</h1>

          <div className="flex items-center space-x-3">
            <div className="flex">
              <input
                type="text"
                placeholder="Type here to search..."
                className="border border-gray-300 rounded-l-full px-4 py-2 h-10"
              />
              <button className="border border-gray-300 rounded-r-full px-4">
                <FiSearch />
              </button>
            </div>
            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">
              No course posted yet by admin
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="border p-4 rounded-lg">
                   {/* <img
                    src={course.images?.[0]?.url || "https://via.placeholder.com/300"}
                    alt={course.title}
                    className="rounded mb-4 w-full h-40 object-cover"
                    /> */}
                    <img
                      src={course.images?.[0]?.url || "https://via.placeholder.com/300"}
                      alt={course.title}
                      crossOrigin="anonymous"
                      className="rounded mb-4 w-full h-40 object-cover"/>


                  <h2 className="font-bold">{course.title}</h2>

                  <p className="text-gray-600">
                    {course.description?.slice(0, 100)}...
                    </p>

                   <div className="flex justify-between items-center mb-4">
                     <span className="font-bold text-xl">
                        ₹{course.price}{" "}
                        <span className="text-gray-500 line-through">5999</span>
                     </span>
                    <span className="text-green-600">20% off</span>
                  </div>

                 <Link
                   to={`/buy/${course._id}`}
                   className="block bg-orange-500 text-white text-center py-2 rounded hover:bg-blue-900 transition-colors duration-300"
                    >
                   Buy Now
                 </Link>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;

