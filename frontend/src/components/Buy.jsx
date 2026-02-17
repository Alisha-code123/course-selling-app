import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState("");
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem("token");
 
  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch course + payment intent
  useEffect(() => {
    if (!token) return;

    const fetchCourseData = async () => {
      try {
        setFetching(true);
        const res = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCourse(res.data.course);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Fetch course error:", err);
        if (err.response?.status === 400) 
          navigate("/purchases");
        else if (err.response?.status === 401) {
          toast.error("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load course");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCardError("");

    try {
      if (!stripe || !elements) throw new Error("Stripe not loaded");

      const card = elements.getElement(CardElement);
      if (!card) throw new Error("Card element not found");
      if (!clientSecret) throw new Error("Payment not initialized");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user?.user?.firstName || "Customer",
              email: user?.user?.email || "customer@example.com",
            },
          },
        });

      if (stripeError) throw stripeError;
      if (paymentIntent.status !== "succeeded") throw new Error("Payment failed");
      if (!token) {
        toast.error("You must be logged in to make a purchase");
        navigate("/login");
        return;
      }
     await axios.post(
      "http://localhost:4001/api/v1/order",
    {
       email: user?.email,
       userId: user?._id,
       courseId,
       paymentId: paymentIntent.id,
       amount: paymentIntent.amount,
       status: paymentIntent.status,
    },
    {
        headers: { Authorization: `Bearer ${token}` }, // ✅ correct
        withCredentials: true,
     }
   );
      toast.success("Payment Successful 🎉");
      navigate("/purchases");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error in making payment");
    } finally {
      setLoading(false);
    }
  };

  // Render states
  if (fetching) {
    return <p className="text-center mt-20">Loading course details...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  if (!course) {
    return <p className="text-center mt-20">Course not found.</p>;
  }
  return (
  <div className="flex flex-col sm:flex-row my-40 container mx-auto">
    {/* Order Details */}
    <div className="w-full md:w-1/2">
      <h1 className="text-xl font-semibold underline">Order Details</h1>

      <div className="mt-4">
        <p className="text-sm text-gray-600">Course</p>
        <p className="font-bold">{course.title}</p>
      </div>

      <div className="mt-2">
        <p className="text-sm text-gray-600">Total Price</p>
        <p className="text-red-500 font-bold">${course.price}</p>
      </div>
    </div>

    {/* Payment Section */}
    <div className="w-full md:w-1/2 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">
          Process your Payment!
        </h2>

        <label className="block text-sm text-gray-600 mb-2">
          Credit / Debit Card
        </label>

        <form onSubmit={handlePurchase}>
          <div className="border rounded-md p-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>

          {cardError && (
            <p className="text-red-500 text-xs mt-2">
              {cardError}
            </p>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="mt-6 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>

        {/* Other Payment Button */}
        <button
          type="button"
          className="mt-3 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition flex items-center justify-center"
        >
          <span className="mr-2">🅿️</span>
          Other Payments Method
        </button>
      </div>
    </div>
  </div>
);
}

export default Buy;
