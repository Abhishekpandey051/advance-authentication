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
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword || newPassword)) {
    throw new ApiError(400, "Old password and new password are required");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordMatched(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }
  user.password = newPassword;
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
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

//send verifivation opt to user's email - API
const sendVerifyOtp = asyncHandler(async (req, res) => {
 const user = await User.findById(req.user?._id);
 console.log("Checking user ", user)
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if(user.isAccountverify){
    res.status(200).json(new ApiError(200, {}, "Your account already verify"))
  }
  const otp = String(Math.floor(10000 + Math.random() * 900000))
  user.varifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000
  await user.save({ validateBeforeSave: true })

  const mailOption = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Account verification mail",
    text: `Your OTP is ${otp}. Verify your account using this OTP`
  }
  const mailRes = await transporter.sendMail(mailOption)
  if(mailRes){
  res.status(200).json(new ApiResponse(200, {}, "Verification OTP send on your email"))
  }
})


export { userRegister, userLogin, userLogout, changePassword, getUserProfile, sendVerifyOtp };
