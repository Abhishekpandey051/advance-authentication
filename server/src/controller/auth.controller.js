import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import { transporter } from "../nodemailer/nodemailer.js";

const options = {
  httpOnly: true,
  secure: true,
};

// register user - API
const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    res.status(400);
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -varifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt"
  );
  //sending welcome email to user
  try {
    const emailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to our application",
      text: `Hello ${user.name},\n\nThank you for registering with our application! We're excited to have you on board.\n\nBest regards,\nThe Team`,
    };

    await transporter.sendMail(emailOption);

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User register successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }
});

// Login user - API
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new ApiError(400, "user does not exist");
  }
  const isPasswordCorrect = await user.isPasswordMatched(password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new ApiError(400, "Invalid credentials");
  }
  const accessToken = await user.generateAccssToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User login successfully"
      )
    );
});

// logout user - API
const userLogout = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        accessToken: 1,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, user, "User logout successfully"));
});

// change (forgot) current password - API
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, otp } = req.body;
  if (!(oldPassword || newPassword || otp)) {
    throw new ApiError(400, "Old password, OTP and new password are required");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordMatched(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }
  if(user.resetOtp === "" ||  String(user.resetOtp).trim() !== String(otp).trim()) {
    throw new ApiError(400, "Invalid OTP");
  }

  if(user.resetOtpExpireAt < Date.now()) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }
  user.password = newPassword;
  user.resetOtp = ""
  user.resetOtpExpireAt = 0
  const updatePassword = await user.save({ validateBeforeSave: true });
  if (!updatePassword) {
    throw new ApiError(500, "Something went wrong while updating password");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// get user profile - API
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {name:user.name, isAccountverify: user.isAccountverify}, "User profile fetched successfully"));
});

//send verifivation opt to user's email - API
const sendVerifyOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if (user.isAccountverify) {
    res.status(200).json(new ApiError(200, {}, "Your account already verify"));
  }
  const otp = String(Math.floor(10000 + Math.random() * 900000));
  user.varifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: true });

  try {
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification mail",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };
    await transporter.sendMail(mailOption);
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Verification OTP send on your email"));
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }
});

//Check account verify - API
const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isAccountverify) {
    throw new ApiError(409, "Account already verified");
  }

  if (user.verifyOtpExpireAt < Date.now()) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  if (
    user.varifyOtp === "" ||
    String(user.varifyOtp).trim() !== String(otp).trim()
  ) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.isAccountverify = true;
  user.varifyOtp = ""; // clear OTP after use
  user.verifyOtpExpireAt = 0; // clear expiry
  await user.save({ validateBeforeSave: true });
  res.status(200).json(new ApiResponse(200, {}, "Accound verify successfull"));
});

// send password reset OTP - API
const sendResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = String(Math.floor(10000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: true });

  try {
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for reseting your password is ${otp}. Use this OTP to procces with reseting your password`,
    };
    await transporter.sendMail(mailOption);
    res.status(200).json(new ApiResponse(200, {}, "OTP send your email"));
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP. Please try again.");
  }
});

export {
  userRegister,
  userLogin,
  userLogout,
  changePassword,
  getUserProfile,
  sendVerifyOtp,
  verifyEmail,
  sendResetOtp,
};
