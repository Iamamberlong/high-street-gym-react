import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default function auth(allowed_roles) {
  return function (req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log("req.headers in middleware: ", req.headers)
    console.log("token in the middleware is: ", token);

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "No token received.",
      })}

      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid or expired token" });
        }

        if (allowed_roles.includes(decoded.role)) {
          req.user = decoded; // Attach user info to request
          console.log("req.user in the middleware: ", decoded);
          next();
        } else {
          res.status(403).json({ message: "Access forbidden" });
        }
      });
    } 
}

