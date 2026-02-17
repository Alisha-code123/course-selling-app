
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51Swe26AMAh6QVI33MDvUkTWNXTGlm7PAF0NFMnqNO8VSZSlve3U7KrUrNY5mpWfkN67iJXxfnnew67ztu86JN3mg00voXZ3hEj");

createRoot(document.getElementById('root')).render(

   <Elements  stripe={stripePromise}>
          <BrowserRouter>
             <App />
          </BrowserRouter>
  </Elements>
)
