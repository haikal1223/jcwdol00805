require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, `${JWT_KEY}`, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  },

  validateToken: (token) => {
    return jwt.verify(token, `${JWT_KEY}`, { algorithm: "HS256" });
  },
};
