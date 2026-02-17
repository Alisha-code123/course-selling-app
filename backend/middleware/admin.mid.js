import jwt from "jsonwebtoken"; 
import config from "../config.js";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
    console.log("Decoded token:", decoded);

    if (!decoded.isAdmin) {
      return res.status(403).json({ errors: "You are not an admin" });
    }

    req.adminId = decoded.id; // used by updateCourse
    next();
  } catch (error) {
    console.log("error in admin middleware", error);
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default adminMiddleware;
