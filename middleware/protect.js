const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.staff = decoded.id; // Attach staff ID to request

      next(); // Token is valid, proceed to the route
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token provided"
    });
  }
};

module.exports = protect;