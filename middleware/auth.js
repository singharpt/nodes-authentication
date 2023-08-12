// This function does the JWT Authentication

const jwt = require("jsonwebtoken");

// get the JWT secret key from the .env file
const secretKey = process.env.JWT_SECRET_KEY;

exports.adminAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secretKey, (err, decodeToken) => {
      if (err) {
        res.status(400).json({ message: "Unauthorized User" });
      } else {
        if (decodeToken.role === false) {
          return res.status(400).json({ message: "Unauthorized User" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(400)
      .json({ message: "Unauthorized User, Token not available" });
  }
};
