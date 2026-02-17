import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";


function Home() {
  const [courses, setCourses] = useState([]);
  const[isLoggedIn,setIsLoggedIn]= useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
    setIsLoggedIn(true)
  }else{
    setIsLoggedIn(false)
  }
  },[])


  const handleLogout = () => {
  localStorage.removeItem("token");   // ✅ remove JWT
  setIsLoggedIn(false);               // ✅ update UI
  toast.success("Logged out successfully");
};
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(res.data.courses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-linear-to-r from-black to-blue-950 min-h-screen text-white">
      {/* HEADER */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-10 h-10 rounded-full" />
          <h1 className="text-2xl font-bold text-orange-500">LearnBase</h1>
        </div>
        <div className="space-x-4">
        {isLoggedIn?(
            // <button onClick={handleLogout}
            // to={"/login"}
            // className="bg-transparent text-white py-2 px-4 border border-white rounded">
            //   Logout
            // </button>
            <button
             onClick={handleLogout}
              className="bg-transparent text-white py-2 px-4 border border-white rounded">
               Logout
            </button>

        ): ( <>
        <Link
        to={"/login"}
        className="bg-transparent text-white py-2 px-4 border border-white rounded">
         Login
        </Link>
        <Link
        to={"/signup"}
        className="bg-transparent text-white py-2 px-4 border border-white rounded">
          Signup
        </Link>
        </> )
        }
        </div>
      </header>

      {/* HERO */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">LearnBase</h1>
        <p className="text-gray-400 mb-6">
          Sharpen your skills with courses crafted by experts.
        </p>
        <div className="space-x-4 mt-8">
          <Link to ={"/courses"} className="bg-green-500 text-white  px-6 py-3 rounded hover:bg-white duration-300 hover:text-black transition">
            Explore Courses
          </Link>
          <Link to={"https://www.youtube.com/@ApnaCollegeOfficial"}
          className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white transition">
            Course Videos
          </Link>
        </div>
      </section>

      {/* COURSES SLIDER */}
      <section className="container mx-auto px-6 pb-20">
        <Slider {...settings}>
          {courses.map((course) => (
            <div key={course._id} className="px-3">
              <div className="bg-[#0f172a] rounded-xl p-6 text-center shadow-lg">
                <img
                  src={course?.images?.[0]?.url || "/placeholder.jpg"}
                  alt={course.title}
                  className="h-32 mx-auto object-contain mb-4"
                />
                <h2 className="text-lg font-semibold mb-3">
                  {course.title}
                </h2>
                <button className="bg-orange-500 text-white  px-4 py-2 rounded-full  hover:bg-blue-600 duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <hr className="border-gray-700" />

      {/* FOOTER */}
      <footer className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <img src={logo} className="w-10 h-10 rounded-full" />
              <h2 className="text-xl font-bold text-orange-500">LearnBase</h2>
            </div>
            <p className="mt-4 mb-2">Follow us</p>
            <div className="flex justify-center md:justify-start gap-4">
              <FaFacebook className="text-xl hover:text-blue-500 cursor-pointer" />
              <FaInstagram className="text-xl hover:text-pink-500 cursor-pointer" />
              <FaTwitter className="text-xl hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Connects</h3>
            <ul className="space-y-2 text-gray-400">
              <li>YouTube – Learn Coding</li>
              <li>Telegram – Learn Coding</li>
              <li>GitHub – Learn Coding</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">© 2024 LearnBase</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Refund & Cancellation</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

