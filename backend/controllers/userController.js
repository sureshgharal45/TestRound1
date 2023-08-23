const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;
  const result = await User.findOne({ email });
  if (result) {
    return next(new ErrorHandler("User has already been registered", 401));
  }

  const user = await User.create({ name, email });

  sendToken(user, 201, res);
});
