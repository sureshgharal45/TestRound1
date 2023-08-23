const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong JWT error
  if (err.code === "jsonWebTokenError") {
    const message = `Json web token is invalid, please try again`;
    err = new ErrorHandler(message, 400);
  }

  //JWT expire error
  if (err.code === "TokenExpiredError") {
    const message = `Json web token is expired, please try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
