import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  try {
  const response = await axios.post(
    `${ BACKEND_URL }/admin/signup`,
    {
      firstName,
      lastName,
      email,
      password,
    },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  console.log("Signup successful:", response.data);
  toast.success("Signup successful!");
  navigate("/admin/login");

} catch (error) {
  console.error("Signup error response:", error.response?.data);
  setErrorMessage(
    error.response?.data?.error ||
    error.response?.data?.errors?.[0]?.message ||
    "Signup failed"
  );
}}
  return (
    <div className="bg-linear-to-r from-black to-blue-950 min-h-screen text-white">
      {/* HEADER */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-10 h-10 rounded-full" alt="Logo" />
          <h1 className="text-2xl font-bold text-orange-500">LearnBase</h1>
        </div>
        <div className="space-x-4">
          <Link to="/admin/login" className="border px-4 py-2 rounded">
            Login
          </Link>
          <Link to="/course" className="bg-amber-500 border px-4 py-2 rounded">
            Join now
          </Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="flex justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">LearnBase</span>
          </h2>

          <p className="text-center text-gray-400 mb-6">
            Just signup to mess with dashboard!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-gray-400 mb-2">Firstname</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 mb-2">Lastname</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-600 text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
