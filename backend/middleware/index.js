const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (error) {
      throw new Error("Invalid/Expired token");
    }
  }
  next();
};

module.exports = authMiddleware;
