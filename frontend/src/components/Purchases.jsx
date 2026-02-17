import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);




  // ✅ Load token & login state
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setIsLoggedIn(!!storedToken);
  }, []);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (token === null) return; // wait for token to load

    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Fetch purchases
  useEffect(() => {
    if (!token) 
      return;

    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // 👈 IMPORTANT: backend sends { purchased, courseData }
        setPurchases(response.data.courseData);
      } catch (error) {
        const msg =
          error.response?.data?.errors ||
          error.response?.data?.message ||
          "Failed to fetch purchase data";
        setErrorMessage(msg);
        toast.error(msg);
      }
    };

    fetchPurchases();
  }, [token]);

  // ✅ Logout
 const handleLogout = async () => {
  if (!token) {
    toast.error("Please login to purchase the course");
    navigate("/login");
    // navigate("/purchases");
    return;
  }

  if (loading) return; 
  setLoading(true);

  try {
    // setLoading(true);

    const res = await axios.get(
      `${BACKEND_URL}/course/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // ✅ important if cookies are used
      }
    );

    toast.success(res.data.message || "Course purchased successfully!");
    navigate("/purchases");
  } catch (error) {
    const status = error.response?.status;

    if (status === 400) {
      toast.error(
        error.response?.data?.errors ||
        "You have already purchased this course"
      );
    } else {
      toast.error(
        error.response?.data?.errors ||
        "Something went wrong"
      );
    }
  } finally {
    setLoading(false);
  }
};


  return (
 <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4 text-blue-500 flex items-center">
              <FaDownload className="mr-2" /> Purchases
            </li>
            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
      >
        {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 md:ml-64">
        <h2 className="text-xl font-semibold mb-6">My Purchases</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md p-4">
              <img
                      src={course.images?.[0]?.url || "https://via.placeholder.com/300"}
                      alt={course.title}
                      crossOrigin="anonymous"
                      className="rounded mb-4 w-full h-40 object-cover"
              />
            <div className="p-4">
              <h3 className="font-semibold text-lg">
                {course.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {course.description?.slice(0, 80) || "No description"}...
              </p>

              <p className="text-green-600 font-bold mt-3">
                ₹{course.price} only
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">You have no purchases yet.</p>
    )}</div>
    </div>
  );
}
export default Purchases;
